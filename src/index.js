const clear = require('clear')
const clearLine = require("clear-terminal-line")
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const io = require('socket.io-client')
const logUpdate = require('log-update')
const { Spinner } = require('clui')
const playSound = require('play-sound')
const notifier = require('node-notifier')
const path = require('path')
const { has, flatMap } = require('lodash/fp')
const { wait } = require('./utils/promise')
const { convertTo1337 } = require('./utils/1337')
const Cursor = require('terminal-cursor')


class App {
  constructor(serverUrl) {
    this.socket = io(serverUrl)
    this.player = playSound()
    this.cursor = new Cursor(1, 1)

    this.handlers = {
      '/mute': {
        action: 'toggleMute',
        description: 'to mute or unmute the notification when a new message is received.'
      },
      '/users': {
        action: 'displayUsers',
        description: 'to display the list of all connected users.'
      },
      '/1337': {
        action: 'toggleLeetSpeak',
        description: 'to toggle the leetSpe4k mode 1!!1!1!'
      }
    }

    this.state = {
      username: 'An0nYM0u5',
      isMuted: false,
      userList: [],
      isLeetSpeak: false,
    }
  }

  setState(stateAtom) {
    const nextState = Object.assign({}, this.state, stateAtom)
    this.stateWillUpdate(nextState)
    this.state = nextState
  }

  stateWillUpdate(nextState) {
    if (this.state.isMuted !== nextState.isMuted) {
      process.stdout.write("\r\x1b[K")
      console.log(chalk.cyan(`m3553n93r2 is now ${nextState.isMuted ? 'muted' : 'unmuted'}.`))
    }

    if (this.state.isLeetSpeak !== nextState.isLeetSpeak) {
      process.stdout.write("\r\x1b[K")
      console.log(chalk.cyan(`m3553n93r2 is now in ${nextState.isLeetSpeak ? '1337' : 'normal'} mode.`))
    }
  }

  toggleMute() {
    this.setState({ isMuted: !this.state.isMuted })
  }

  toggleLeetSpeak() {
    this.setState({ isLeetSpeak: !this.state.isLeetSpeak })
  }

  start() {
    this.printHomeScreen()
    this.connect()
      .then(() => this.printConnectionSuccess())
      .then(() => this.login())
      .then(username => this.setState({ username }))
      .then(() => this.joinRoom())
      .then(() => this.printLoginSucess())
      .then(() => this.listen())
      .then(() => this.printPrompt())
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket.on('connect', (err) => {
        if (err) reject()
        else resolve()
      })
    })
  }

  joinRoom() {
    this.socket.emit('user_join', this.state.username)
    return Promise.resolve()
  }

  login() {
    return inquirer
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
      .then(({ username }) => username)
  }

  listen() {
    this.socket.on('message', message => this.onReceiveMessage(message))
    this.socket.on('user_join', user => this.onUserJoin(user))
    this.socket.on('user_leave', user => this.onUserLeave(user))
    this.socket.on('user_list_update', users => this.onUserListUpdate(users))
  }

  onReceiveMessage({ username, content }) {

    if (!this.state.isMuted) {
      // this.player.play(path.join(__dirname, 'assets', 'media', 'decay.mp3'))
      notifier.notify({
        title: `${username} s4y5 :`,
        message: content,
        icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
        sound: true,
      })
    }

    this.printMessage({ username, message: content })
  }

  onUserJoin(user) {
    process.stdout.write("\r\x1b[K")
    console.log(chalk.green(`${user} has joined the chat.`))
  }

  onUserLeave(user) {
    process.stdout.write("\r\x1b[K")
    console.log(chalk.red(`${user} has left the chat.`))
  }

  onUserListUpdate(userList) {
    this.setState({userList: userList})
  }

  printHomeScreen() {
    clear()
    console.log(
      chalk.cyan.dim(
        figlet.textSync('m3553n93r2', { horizontalLayout: 'full' })
      )
    )
    this.spinner = new Spinner('Connecting to chat')
    this.spinner.start()
  }

  printConnectionSuccess() {
    this.spinner.stop()
    process.stdout.write('\n')
    console.log(chalk.cyan('Client successfully connected!'))
    return Promise.resolve()
  }

  printLoginSucess() {
    const commandsInfo = flatMap(
      cmd => [
        chalk.cyan('\ttype'),
        chalk.white.bold(cmd),
        chalk.cyan(`${this.handlers[cmd].description}\n`),
      ],
      Object.keys(this.handlers)
    )

    console.log(
      chalk.magenta(`\n\n\tWelcome H4ck3r ${this.state.username}\n`),
      chalk.white.bold('\n\nWe g0t som3 c0ol comm4nds th4t you ne3d t0 kn0w:\n\n'),
      ...commandsInfo,
      chalk.white.bold('\n\nEnj0y th1s r3sp0n5ibly... \n\n')
    )
    return wait(500)
  }

  printMessage({ username, message, isMe = false }) {
    process.stdout.write("\r\x1b[K")

    if (isMe) {
      // remove the input line
      this.cursor.move('up', 1)
      process.stdout.write("\r\x1b[K")
    }

    console.log(chalk.green('?'), chalk.white.bold(`${username}: `) + chalk.cyan(message))
  }

  printPrompt() {
    return inquirer
      .prompt([{
        name: 'message',
        type: 'input',
        message: `${this.state.username}:`,
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
      .then(({ message }) => this.handleMessage(message))
      .then(() => this.printPrompt())
  }

  handleMessage(message) {
    const msg = message.trim()

    if (has(msg, this.handlers)) this[this.handlers[msg].action](msg)
    else this.emitMessage(msg)

    return Promise.resolve()
  }

  toggleMute() {
    this.setState({ isMuted: !this.state.isMuted })
  }

  displayUsers() {
    console.log(this.state);
    process.stdout.write("\r\x1b[K")
    console.log(chalk.cyan(`${this.state.userList}`))
  }

  emitMessage(message) {
    const msg = this.state.isLeetSpeak ? convertTo1337(message) : message

    this.socket.emit('message', {
      content: msg,
      username: this.state.username
    })

    this.printMessage({ username: this.state.username, message: msg, isMe: true })

    return Promise.resolve()
  }

}

const app = new App('https://m3553n93r2.herokuapp.com/')

app.start()
