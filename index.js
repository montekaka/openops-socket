import express from 'express';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import axios from "axios";

const router = express.Router();

dotenv.config();
let port = 3000;
if( process.env.NODE_ENV === 'development') {
  port = 8000;
}

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
// app.use(logger('dev'));

// socket.io config
const httpServer = createServer(app);
// https://stackoverflow.com/questions/59749021/socket-io-error-access-to-xmlhttprequest-has-been-blocked-by-cors-policy

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_HOST,
    methods: ["GET", "POST"]
  }
});

// handle cross sites request
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if([process.env.CLIENT_HOST, process.env.WECHATY_MS].indexOf(origin) > -1){
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Origin', origin);
  // res.header("Access-Control-Allow-Origin", process.env.ALLOW_CLIENT_WHITE_LIST);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.io = io; // add socket.io

  next();
});

io.on('connect', socket => {
  console.log('User connected')
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// routers
// recevie message from wechaty, saving to our database, and forward to our front end app
router.post('/v1/forward-message', async(req, res) => {
  // TODO: save the message to our database  
  const data = req.body;
  // const socketId = data.socketId;
  const socketId = 'wechat';
  res.io.emit(socketId, {
    type: 'new-message',
    data
  });
  res.send('success');
})

// send message thru wechaty
router.post('/v1/wechaty-message', async (req, res) => {  
  const name = req.body.name;
  const message = req.body.message;

  try {
    const wechatyRes = await axios.post(`${process.env.WECHATY_MS}/v1/message`, {
      name, message
    })
    // save the message to database
    res.sendStatus(200)
  } catch (err) {
    // todo ping user on with socket.io that message failed to send
    res.sendStatus(500);
  }
})

// wechat new friend request
// {
//   kfWechatId, 
//   fromUserName, 
//   fromUserId,
//   fromUserAvatar
// }
router.post('/v1/wechat-friendship', async (req, res) => {  

  const data = req.body;
  const socketId = 'wechat';
  res.io.emit(socketId, {
    type: 'new-friend',
    data
  });
  res.send('success');
  // TODO: change to use an unify socket
  // TODO: save to database...
})

// data for getting list of contacts 
router.get('/v1/contacts', (req, res) => {
  res.send([
    {"name": "Kaka", "id": "7881300233152715", "avatar": "http://mmhead.c2c.wechat.com/mmhead/SMt4cxnN46q1o0KsondHotCuFkCZh28ZbKHichbnFRFbiad2ZkRFswkg/0"},
    {"name": "may 张丹萍", "id": "7881302734171450", "avatar": "http://mmhead.c2c.wechat.com/mmhead/bVy2VQVTWzbNu2kVtzRgbiaPAO53Ws8uG1HB7PS2bBGNr6mEfj80XUA/0"}
  ])
})

app.use(router);

httpServer.listen(port, () => {
  console.log(`App version 1.0 listening on port ${port}!`);
})

