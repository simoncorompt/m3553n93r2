const { flatMap } = require('lodash/fp')
const { Spinner } = require('clui')
const Cursor = require('terminal-cursor')
const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')
const { wait } = require('../utils/promise')

/* ----------------------------------------- *
        Private
* ----------------------------------------- */
const connectingSpinner = new Spinner('Connecting to chat')
const cursor = new Cursor(1, 1)

// log : String -> Promise
const log = (...info) => {
  process.stdout.write("\r\x1b[K")
  console.log(...info)
  return Promise.resolve()
}

/* ----------------------------------------- *
        Public
* ----------------------------------------- */

// homeScreen : _ -> Promise
const homeScreen = () => {
  clear()
  return log(
    chalk.cyan.dim(
      figlet.textSync('m3553n93r2', { horizontalLayout: 'full' })
    )
  )
    .then(() => connectingSpinner.start())
}

// connectionSuccess : _ -> Promise
const connectionSuccess = () => {
  connectingSpinner.stop()
  return log(chalk.cyan('\nClient successfully connected!'))
}

// welcome : String -> Promise
const welcome = username => log(
  chalk.magenta(`\n\n\tWelcome H4ck3r ${username}`)
)

// Command : { name : String, description : String }
// help : [Command] -> Promise
const help = commands => {
  const commandsInfo = flatMap(
    ({ name, description }) => [
      chalk.cyan('\ttype'),
      chalk.white.bold(name),
      chalk.cyan(`${description}\n`),
    ],
    commands
  )

  return log(
    chalk.white.bold('\n\nWe g0t som3 c0ol comm4nds th4t you ne3d t0 kn0w:\n\n'),
    ...commandsInfo,
    chalk.white.bold('\n\nEnj0y th1s r3sp0n5ibly... \n\n')
  )
    .then(() => wait(500))
}

// message : { username : String, message : String } -> Promise
const message = ({ username, message, isMe = false }) => log(
  chalk.green('?'),
  chalk.white.bold(`${username}:`),
  chalk.cyan(message)
)

// myMessage : { username : String, message : String } -> Promise
const myMessage = (msg) => {
  // remove the input line
  cursor.move('up', 1)
  process.stdout.write("\r\x1b[K")
  return message(msg)
}

// activeUsers : [String] -> Promise
const activeUsers = activeUsers => log(
  chalk.magenta('\nC0nnect3d H#ckerz :\n'),
  chalk.cyan(activeUsers.reduce(
    (acc, username) => `${acc}\t- ${username}\n`,
    ''
  ))
)

// userJoined : String -> Promise
const userJoined = username => log(
  chalk.green(`${username} has joined the chat.`)
)

// userLeft : String -> Promise
const userLeft = username => log(
  chalk.red(`${username} has left the chat.`)
)

// mutedStatus : Boolean -> Promise
const mutedStatus = isMuted => log(
  chalk.cyan(`m3553n93r2 is now ${isMuted ? 'muted' : 'unmuted'}.`)
)

// leetSpeakStatus : Boolean -> Promise
const leetSpeakStatus = isLeetSpeak => log(
  chalk.cyan(`m3553n93r2 is now in ${isLeetSpeak ? '1337' : 'normal'} mode.`)
)

module.exports = {
  homeScreen,
  connectionSuccess,
  welcome,
  help,
  message,
  myMessage,
  activeUsers,
  userJoined,
  userLeft,
  mutedStatus,
  leetSpeakStatus,
}
