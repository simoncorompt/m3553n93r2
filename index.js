var clear = require('clear')
var clearLine = require("clear-terminal-line")
var chalk = require('chalk')
var figlet = require('figlet')
var inquirer = require('inquirer')
var io = require('socket.io-client')
var logUpdate = require('log-update')
var clui = require('clui')
Spinner = clui.Spinner


var socket = {}
var username = '4N0nyM0u2'

function init() {
  launch()
  connect()
}

function launch() {
  clear()
  console.log(
    chalk.cyan.dim(
      figlet.textSync('m3553n93r2', { horizontalLayout: 'full' })
    )
  )
}

function connect() {
  socket = io('https://m3553n93r2.herokuapp.com/')

  var loading = 100
  var countdown = new Spinner('Connecting to chat')
  countdown.start()

  var interval = setInterval(function() {
    loading--

    if (loading <= 0) {
      countdown.stop()
      process.stdout.write('\n')
      clearInterval(interval)
      console.log(chalk.cyan('Client successfully connected!'))
      socket.on('connect', listen())
    }

  }, 10)

}

function listen() {

  login()

  socket.on('message', messageReceived)

}

function messageReceived(message) {
  var username = message.username
  var message = message.content
  process.stdout.write('\033[' + (username.length + 4).toString() + 'D')
  console.log(chalk.cyan(`${username}: `) + message)
}

function promptMessage() {

  var questions = [
    {
      name: 'message',
      type: 'input',
      message: `${username}:`
    }

  ]


  inquirer
    .prompt(questions)
    .then( function(arguments) {
      message = arguments.message
      process.stdout.write('\033[' + "1" + 'A')
      process.stdout.write('\033[' + (username.length + 4).toString() + 'D')
      process.stdout.write('\033[K')
      console.log(chalk.cyan(`${username}: `) + message)

      socket.emit('message', {
        content: message,
        username: username
      })


      promptMessage()
    })



}

function login() {

  var questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your username:',
      validate: function(value) {
        if (value.length < 10) {
          return true;
        } else {
          return 'Way too long...';
        }
      }
    }
  ]

  inquirer
    .prompt(questions)
    .then( function(arguments) {
      username = arguments.username
      promptMessage()
    })

}



init()
