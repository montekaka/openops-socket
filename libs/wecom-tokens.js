import fs from 'fs'

const getContactAccessToken = () => {
  const data = fs.readFileSync('tmp/contact-access-token.txt')
  return data.toString();
}

const getMessageAccessToken = () => {
  const data = fs.readFileSync('tmp/message-access-token.txt')
  return data.toString();
}

const getMemberAccessToken = () => {
  const data = fs.readFileSync('tmp/member-access-token.txt')
  return data.toString();
}

export {
  getContactAccessToken,
  getMessageAccessToken,
  getMemberAccessToken
}