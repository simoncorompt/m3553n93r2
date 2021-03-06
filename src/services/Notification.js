const { NotificationCenter } = require('node-notifier')
const path = require('path')
const open = require('open')
const { containsUrl, extractUrl } = require('../utils/url')

const notifier = new NotificationCenter()

const notify = options => new Promise((resolve, reject) => {
  notifier.notify(options, (err, response, metadata) => {
    if (err) return reject(err)
    else resolve({ response, metadata })
  })
})

const notifyMessage = ({ username, message }) => notify({
  title: `${username} s4y5 :`,
  message,
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png')
})

const notifyLink = ({ username, message }) => notify({
  title: `${username} s3n7 a l1nk :`,
  message: `Cl1ck here t0 0pen it.\n${extractUrl(message)}`,
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
  open: extractUrl(message),
})

const messageReceived = ({ username, message }) => {
  return (
    containsUrl(message)
      ? notifyLink({ username, message })
      : notifyMessage({ username, message })
  )
}

const userJoined = username => notify({
  title: `${username} Joined the Ch4t`,
  message: 'c0me say h3ll0.',
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
})

const userLeft = username => notify({
  title: `${username} Left the Ch4t`,
  message: 't0o b4d.',
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
})


module.exports = {
  messageReceived,
  userJoined,
  userLeft,
}
