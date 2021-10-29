// https://work.weixin.qq.com/api/doc/90000/90135/90238
import axios from "axios";
import fs from "fs";
import dotenv from 'dotenv';
import {getContactAccessToken} from './../libs/index.js'
dotenv.config();
const corpID = process.env.WECOM_CORP_ID;
const appSecret = process.env.WECOM_CORP_APP_SECRET;
const corpSecret = process.env.WECOM_CORP_SECRET;

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
  getDepartments,
  getMembers
}