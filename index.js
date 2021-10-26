import express from 'express';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import axios from "axios";

const router = express.Router();

dotenv.config();
let port = 3000;
if( process.env.NODE_ENV === 'development') {
  port = 3000; //49160
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
router.post('/v1/forward-message', async(req, res) => {
  const data = req.body;
  const socketId = data.socketId;
  console.log(data)
  res.io.emit(socketId, data);
  res.send('success');
})

app.use(router);

httpServer.listen(port, () => {
  console.log(`App version 1.0 listening on port ${port}!`);
})

