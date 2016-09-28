const imageToAscii = require("image-to-ascii")

const regex = /^https?:\/\/(?:[a-z\-\.]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/

const hasImage = str => regex.test(str)

const toAscii = str => {
  return new Promise( (resolve, reject) => {
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
}

module.exports = {
  hasImage,
  toAscii
}
