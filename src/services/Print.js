const { flatMap } = require('lodash/fp')
const { Spinner } = require('clui')
const inquirer = require('inquirer')
const Cursor = require('terminal-cursor')
const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')
const { wait } = require('../utils/promise')
const { formatTime } = require('../utils/time')

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

const formatDate = time => [
  chalk.green('?'),
  chalk.white(`[${formatTime(time)}]`)
]

const formatUsername = (username, isMe = false) => [
  chalk.white.bold(`${username}:`)
]

// remove the input line
const removePreviousLog = () => {
  cursor.move('up', 1)
  process.stdout.write("\r\x1b[K")
}

/* ----------------------------------------- *
        Public
* ----------------------------------------- */


// homeScreen : _ -> Promise
const homeScreen = () => {
  clear()
  return log(
    chalk.cyan.dim(
      figlet.textSync('M3ss3ng3rz', { horizontalLayout: 'full' })
    )
  )
}

// appVersion : String -> Promise
const appVersion = version => log(
  chalk.white(`v${version}\n`)
)

// installLatestVersion : String -> Promise
const installLatestVersion = version => log(
  chalk.magenta(`A new version is available!`),
  chalk.white('Type'),
  chalk.cyan.bold('npm install ch4t@latest -g'),
  chalk.white(`to get v${version}.\n`)
)

const connectionSpinner = () =>
  Promise.resolve(connectingSpinner.start())

// connectionSuccess : _ -> Promise
const connectionSuccess = () => {
  connectingSpinner.stop()
  return log(chalk.magenta('\nClient successfully connected!\n'))
}

// welcome : String -> Promise
const welcome = username => log(
  chalk.magenta(`\nWelcome H4ck3r ${username}\n`)
)

// Command : { name : String, description : String }
// help : [Command] -> Promise
const help = commands => {
  const commandsInfo = flatMap(
    ({ name, description }) => [
      chalk.white('\ttype'),
      chalk.cyan.bold(name),
      chalk.white(`${description}\n\n`),
    ],
    commands
  )

  return log(
    chalk.magenta('\n\nWe g0t som3 c0ol comm4nds th4t you ne3d t0 kn0w:\n\n'),
    ...commandsInfo,
    chalk.magenta('\nEnj0y th1s r3sp0n5ibly... \n\n')
  )
    .then(() => wait(200))
}

// message : { username : String, message : String } -> Promise
const message = ({ username, message, createdAt }) => log(
  ...formatDate(createdAt),
  ...formatUsername(username),
  chalk.cyan(message)
)

// myMessage : { username : String, message : String } -> Promise
const myMessage = ({ username, message, createdAt }) => {
  removePreviousLog()
  return log(
    ...formatDate(createdAt),
    ...formatUsername(username, true),
    chalk.cyan(message)
  )
}

// message : { username : String, message : String, voice : String } -> Promise
const sayMessage = ({ username, message, voice, createdAt }) => log(
  ...formatDate(createdAt),
  ...formatUsername(username),
  chalk.cyan(`${voice || ''} says "${message}"`)
)

// mySayMessage : { username : String, message : String, voice : String } -> Promise
const mySayMessage = ({ username, message, voice, createdAt }) => {
  removePreviousLog()
  return log(
    ...formatDate(createdAt),
    ...formatUsername(username, true),
    chalk.cyan(`${voice || ''} says "${message}"`)
  )
}

// activeUsers : [String] -> Promise
const activeUsers = activeUsers => log(
  chalk.magenta('\nC0nnect3d H#ckerz :\n\n'),
  chalk.white.bold(activeUsers.reduce(
    (acc, username) => `${acc}\t- ${username}\n`,
    ''
  ))
)

// availableRooms :: [String] -> Promise
const availableRooms = rooms => log(
  chalk.magenta('\nH3re 4re tH3 4va1l4ble ro0ms :\n\n'),
  chalk.white.bold(rooms.reduce(
    (acc, room) => `${acc}\t- ${room.name} (${room.users.length})\n`,
    ''
  )),
  chalk.magenta('\nJoin it by typing #<room name>, or /join <room name>\n')
)

// availableVoices :: [String] -> Promise
const availableVoices = voices => log(
  chalk.magenta('\nH3re 4re tH3 v01cez U c4n u5e :\n\n'),
  chalk.white.bold(voices.reduce(
    (acc, voice) => `${acc}\t- ${voice}\n`,
    ''
  ))
)

// availableVoices :: [String] -> Promise
const availableEmojis = emojis => log(
  chalk.magenta('\nH3re 4re tH3 3m0jis U c4n u5e :\n'),
  chalk.white.bold(Object.keys(emojis).reduce(
    (acc, emoji) => `${acc}\t- ${emoji}\n`,
    ''
  )),
  chalk.magenta('\nTh1s is a f#kin lo7 0f em0j1s.\n')
)

// userJoined : String -> Promise
const userJoined = username => log(
  chalk.green(`${username} has joined the chat.`)
)

// userLeft : String -> Promise
const userLeft = (username, userNextRoom) => log(
  chalk.red(
    userNextRoom
      ? `${username} has left this room and joined #${userNextRoom}`
      : `${username} has left the chat.`
  )
)

const joinRoom = room => log(
  chalk.green(`\nyou just joined #${room}.`)
)

// mutedStatus : Boolean -> Promise
const mutedStatus = isMuted => log(
  chalk.magenta(`m3553n93r2 is now ${isMuted ? 'muted' : 'unmuted'}.`)
)

// leetSpeakStatus : Boolean -> Promise
const leetSpeakStatus = isLeetSpeak => log(
  chalk.magenta(`m3553n93r2 is now in ${isLeetSpeak ? '1337' : 'normal'} mode.`)
)

// loginPrompt : _ -> Promise
const loginPrompt = () =>
  inquirer
    .prompt([
      {
        name: 'username',
        type: 'input',
        message: 'Enter your username:',
        validate: value => {
          if (value.length > 10) {
            return 'W4y to0 long...'
          } else if (!value.trim()) {
            return 'Pl34ze tYp3 y0ur Uz3rN4me'
          } else {
            return true
          }
        }
      }
    ])
    .then(({ username }) => username.trim())

// messagePrompt : String -> Promise
const messagePrompt = username =>
  inquirer
    .prompt([{
      name: 'message',
      type: 'input',
      message: `[${formatTime(Date.now())}] ${username}:`,
      validate: value => {
        if (value.length > 255) {
          return 'W4y to0 long...'
        } else if (!value.trim()) {
          return 'Th1s 1s 4 Mess3ngeR 4pp. TyP3 a F#ck1n\' M3ss4ge.'
        } else {
          return true
        }
      }
    }])
    .then(({ message }) => message.trim())


const createRoomCopy = 'Create a new room'

// chooseRoomPrompt : [String] -> Promise
const chooseRoomPrompt = rooms =>
  inquirer
    .prompt([{
      name: 'room',
      type: 'list',
      message: 'Cho0se a room b3llow:',
      choices: rooms
        .map(x => `#${x.name} (${x.users.length})`)
        .concat(createRoomCopy),
      validate: value => {
        if (!value.trim()) {
          return 'Ple4se Cho0se a room b3llow'
        } else {
          return true
        }
      }
    }])
    .then(({ room }) =>
      room.trim()
        .replace(/^#/, '')
        .replace(/\s\([0-9]+\)$/, '')
    )
    .then(room => room === createRoomCopy
      ? createRoomPrompt()
      : room
    )

const createRoomPrompt = () =>
  inquirer
    .prompt([{
      name: 'room',
      type: 'input',
      message: 'Room Name: #',
      validate: value => {
        if (value.length > 30) {
          return 'W4y to0 long...'
        } else if (!value.trim()) {
          return 'You h4ve to typ3 a n4me'
        } else if (!value.trim().match(/^[\w_-]{1,30}$/)) {
          return 'Sp4ces and sp3cials char4cter2 are forb1dden f0r room nam3s'
        } else {
          return true
        }
      }
    }])
    .then(({ room }) => room.trim())


module.exports = {
  homeScreen,
  appVersion,
  installLatestVersion,
  connectionSpinner,
  connectionSuccess,
  welcome,
  help,
  message,
  myMessage,
  sayMessage,
  mySayMessage,
  activeUsers,
  availableRooms,
  availableVoices,
  availableEmojis,
  userJoined,
  userLeft,
  joinRoom,
  mutedStatus,
  leetSpeakStatus,
  loginPrompt,
  messagePrompt,
  chooseRoomPrompt,
}
