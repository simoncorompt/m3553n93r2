const clear = require('clear')
const clearLine = require("clear-terminal-line")
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const io = require('socket.io-client')
const logUpdate = require('log-update')
const { Spinner } = require('clui')

class App {
  constructor(serverUrl) {
    this.socket = io(serverUrl)
    this.username = 'An0nYM0u5'

    this.printHomeScreen()
    this.connect()
      .then(() => this.printConnectionSuccess())
      .then(() => this.login())
      .then(username => this.username = username)
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
          validate: function(value) {
            if (value.length > 10) {
              return 'W4y to0 long...'
            } else if (!value) {
              return 'Pl34ze tYp3 y0ur Uz3rN4me'
            } else {
              return true
            }
          }
        }
      ])
      .then(({ username }) => username)
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

  printPrompt() {
    return inquirer
      .prompt([{
        name: 'message',
        type: 'input',
        message: `${this.username}:`
      }])
      .then(({ message }) => this.emitMessage(message))
      .then(() => this.printPrompt())
  }

  emitMessage(message) {
    this.socket.emit('message', {
      content: message,
      username: this.username
    })
    return Promise.resolve()
  }

  listen() {
    this.socket.on('message', message => this.onReceiveMessage(message))
  }

  onReceiveMessage({ username, content }) {
    process.stdout.write("\r\x1b[K")
    console.log(chalk.green('?'), chalk.white.bold(`${username}: `) + chalk.cyan(content))
  }

}

const app = new App('https://m3553n93r2.herokuapp.com/')
