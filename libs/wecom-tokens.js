import fs from 'fs'

const getContactAccessToken = () => {
  const data = fs.readFileSync('tmp/contact-access-token.txt')
  return data.toString();
}

export {
  getContactAccessToken
}