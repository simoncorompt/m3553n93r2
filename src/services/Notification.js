const notifier = require('node-notifier')
const path = require('path')

const notify = options => Promise.resolve(notifier.notify(options))

const messageReceived = ({ username, message }) =>  notify({
  title: `${username} s4y5 :`,
  message,
  icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
  sound: true,
})

module.exports = {
  messageReceived
}
