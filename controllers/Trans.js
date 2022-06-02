require ('dotenv').config()

const available = (req, res) => {
const https = require('https')
const sk= process.env.SECRET_KEY
const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/bank?currency=GHS&type=mobile_money',
  method: 'GET',
  headers: {
    Authorization: `Bearer ${sk}`
  }
}
https.request(options, res => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  });
  res.on('end', () => {
    console.log(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})
}

module.exports = {available}
