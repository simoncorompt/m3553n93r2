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


class App {
  constructor(serverUrl) {
    this.socket = io(serverUrl)
    this.player = playSound()

    this.handlers = {
      '/mute': {
        action: 'toggleMute',
        description: 'to mute or unmute the notification when a new message is received.'
      }
    }

    this.state = {
      username: 'An0nYM0u5',
      isMuted: false
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
  }

  start() {
    this.printHomeScreen()
    this.connect()
      .then(() => this.printConnectionSuccess())
      .then(() => this.login())
      .then(username => this.setState({ username }))
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

    process.stdout.write("\r\x1b[K")
    console.log(chalk.green('?'), chalk.white.bold(`${username}: `) + chalk.cyan(content))
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
        chalk.cyan('\t type'),
        chalk.white.bold(cmd),
        chalk.cyan(` ${this.handlers[cmd].description} \n`),
      ],
      Object.keys(this.handlers)
    )

    console.log(
      chalk.white.bold('\n\n we g0t som3 c0ol comm4nds: \n\n'),
      ...commandsInfo,
      chalk.white.bold('\n\n Enj0y th1s r3sp0n5ibly... \n\n')
    )
    return wait(500)
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

  emitMessage(message) {
    this.socket.emit('message', {
      content: message,
      username: this.state.username
    })
    return Promise.resolve()
  }

}

const app = new App('https://m3553n93r2.herokuapp.com/')

app.start()
