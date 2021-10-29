// https://work.weixin.qq.com/api/doc/90000/90135/90238
import axios from "axios";
import fs from "fs";
import dotenv from 'dotenv';
import {getContactAccessToken,getMemberAccessToken, getMessageAccessToken} from './../libs/index.js'
dotenv.config();
const corpID = process.env.WECOM_CORP_ID;
const appSecret = process.env.WECOM_CORP_APP_SECRET;
const corpSecret = process.env.WECOM_CORP_SECRET;
const contactSecret = process.env.WECOM_CONTACT_SECRET;

// refresh once an hour
const refreshContactAccessToken = (req, res) => {
  // https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=corpID&corpsecret=corpSecret
  // console.log(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpID}&corpsecret=${appSecret}`)
  return axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpID}&corpsecret=${corpSecret}`)
  .then((result) => {
    // write to tmp
    // console.log(result.data)
    if(result.data.errcode) {     
      res.status(500);  
    } else {
      const accessToken = result.data.access_token;
      fs.writeFileSync(`tmp/contact-access-token.txt`, accessToken)
      // console.log(data)
      res.send(result.data)
    }    
  })
  .catch((err) => {
    
    console.log(err)
    res.status(500);
  })
}

const refreshMessageAccessToken = (req, res) => {
  // console.log('hi')
  // https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${corpsecret}
  // console.log(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpID}&corpsecret=${corpSecret}`)
  return axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpID}&corpsecret=${appSecret}`)
  .then((result) => {
    // write to tmp
    // console.log(result.data)
    if(result.data.errcode) {
      res.status(500);  
    } else {
      const accessToken = result.data.access_token;
      fs.writeFileSync(`tmp/message-access-token.txt`, accessToken)
      // console.log(data)
      res.send(result.data)
    }    
  })
  .catch((err) => {
    // console.log(err)
    res.status(500);
  })
}

const refreshMemberContactAccessToken = (req, res) => {
  return axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpID}&corpsecret=${contactSecret}`)
  .then((result) => {
    // write to tmp
    // console.log(result.data)
    if(result.data.errcode) {
      res.status(500);  
    } else {
      const accessToken = result.data.access_token;
      fs.writeFileSync(`tmp/member-access-token.txt`, accessToken)
      // console.log(data)
      res.send(result.data)
    }    
  })
  .catch((err) => {
    // console.log(err)
    res.status(500);
  })
}


const getDepartments = (req, res) => {
  const access_token = getContactAccessToken();
  // https://work.weixin.qq.com/api/doc/90000/90135/90208
  return axios.get(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${access_token}`)
  .then((result) => {
    if(result.data.errcode) {
      res.status(500);  
    } else {
      res.send(result.data.department);
    }    
  })
  .catch((err) => {
    res.status(500);
  });
}

const getMembers = (req, res) => {
  const access_token = getContactAccessToken();
  const {department_id} = req.params;
  // https://work.weixin.qq.com/api/doc/90000/90135/90201
  return axios.get(`https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${access_token}&department_id=${department_id}`)
  .then((result) => {
    console.log(result.data)
    if(result.data.errcode) {
      res.status(500);  
    } else {
      res.send(result.data.userlist);
    }    
  })
  .catch((err) => {
    res.status(500);
  });
}

const generateMemberQr = (req, res) => {
  const access_token = getMemberAccessToken();
  const {user_id} = req.params;
  console.log({user_id})
  // https://work.weixin.qq.com/api/doc/90000/90135/92572
  // https://qyapi.weixin.qq.com/cgi-bin/externalcontact/add_contact_way?access_token=ACCESS_TOKEN
  return axios.post(`https://qyapi.weixin.qq.com/cgi-bin/externalcontact/add_contact_way?access_token=${access_token}`, {
    "type" :1,
    "scene":2,
    "user": [user_id]
  })
  .then((result) => {
    console.log(result.data)
    if(result.data.errcode) {
      res.status(500);  
      res.send(result.data);
    } else {
      res.send(result.data);
    }    
  })
  .catch((err) => {
    res.status(500);
  });  
}


export {
  refreshContactAccessToken,
  refreshMessageAccessToken,
  refreshMemberContactAccessToken,
  getDepartments,
  getMembers,
  generateMemberQr
}