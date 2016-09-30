const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/
const imageUrlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)\.(?:jpe?g|gif|png)$/

const containsUrl = str => urlRegex.test(str)
const extractUrl = str => str.match(urlRegex)[0]

const isImageUrl = str => imageUrlRegex.test(str)
const extractImageUrl = str => str.match(imageUrlRegex)[0]

module.exports = {
  containsUrl,
  extractUrl,
  isImageUrl,
  extractImageUrl,
}
