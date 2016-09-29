const imageToAscii = require("image-to-ascii")

const regex = /^https?:\/\/(?:[a-z\-\.]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/

const isImageUrl = str => regex.test(str)

const toAscii = str => new Promise((resolve, reject) => {
  imageToAscii(str, {
      colored: true,
      size: {
        height: 30,
      }
  }, (err, converted) => {
    if (err)
      reject(err)
    else
      resolve(converted)
  })
})
  .catch(err => {
    console.log('ascii convertion error :', err)
  })

module.exports = {
  isImageUrl,
  toAscii
}
