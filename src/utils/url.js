const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/
const imageUrlRegex = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&\/=]*\/(([-a-zA-Z0-9_.]*)\.(?:jpe?g|gif|png))((\?|#)[-a-zA-Z0-9@:%._\+~#=\?]+)?$/

const imagePath = /(?:\/)(([(\\\s)-a-zA-Z0-9_.]*)\.(?:jpe?g|gif|png))/i

const containsUrl = str => urlRegex.test(str)
const extractUrl = str => str.match(urlRegex)[0]

const isImageUrl = str => imageUrlRegex.test(str)
const extractImageUrl = str => str.match(imageUrlRegex)[0]
const extractImageFullName = str => str.match(imageUrlRegex)[1]
const extractImageName = str => str.match(imageUrlRegex)[2]
const extractImageExtension = str => str.match(imageUrlRegex)[3]

module.exports = {
  containsUrl,
  extractUrl,
  isImageUrl,
  extractImageUrl,
  extractImageFullName,
  extractImageName,
  extractImageExtension,
}
