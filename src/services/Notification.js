const notifier = require('node-notifier')
const path = require('path')
const open = require('open')
const { containsUrl, extractUrl } = require('../utils/url')


notifier.on('click', (notifierObject, { message }) =>  {
  if (containsUrl(message)) open(extractUrl(message))
})


const notify = options => new Promise((resolve, reject) => {
  notifier.notify(options, (err, response) => {
    if (err) return reject(err)
    else resolve(response)
  })
})


const notifyMessage = ({ username, message }) => notify({
  title: `${username} s4y5 :`,
  message,
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
})

const notifyLink = ({ username, message }) => notify({
  title: `${username} s3n7 a l1nk :`,
  message: `Cl1ck here t0 0pen it.\n${extractUrl(message)}`,
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
  time: 7000,
  wait: true,
})

const messageReceived = ({ username, message }) => {
  return (
    containsUrl(message)
      ? notifyLink({ username, message })
      : notifyMessage({ username, message })
  )
    .catch(err => console.error('notification error', err))
}


module.exports = {
  messageReceived
}
