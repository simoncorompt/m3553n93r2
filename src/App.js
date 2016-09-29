const io = require('socket.io-client')
const { has, prop, drop, head } = require('lodash/fp')
const { convertTo1337 } = require('./utils/1337')
const { isImageUrl, toAscii } = require('./utils/ascii')

const Print = require('./services/Print')
const Notification = require('./services/Notification')
const Audio = require('./services/Audio')

const State = require('./State')

class App extends State {
  constructor(serverUrl) {
    super()

    this.socket = io(serverUrl)

    this.commands = [
      {
        name: '/mute',
        description: 'to mute or unmute the notification when a new message is received.',
        test: /^\/mute$/,
        handler: this.onToggleMute.bind(this),
      },
      {
        name: '/users',
        description: 'to display the list of all connected users.',
        test: /^\/users$/,
        handler: this.onListUsers.bind(this),
      },
      {
        name: '/1337',
        description: 'to toggle the leetSpe4k mode 1!!1!1!',
        test: /^\/1337$/,
        handler: this.onToggleLeetSpeak.bind(this),
      },
      {
        name: '/say <message> | <voice>',
        description: `send a message in speech synthesizer mode.\n\t\tAvailable voices are : ${Audio.voices.join(', ')}`,
        test: /^\/say\s[\w\.\s\|]+$/,
        parse: msg => ({
          message: head(msg.replace('/say ', '').split('|')).trim(),
          voice: (msg.split('|')[1] || '').trim()
        }),
        handler: this.emitSayMessage.bind(this),
      },
    ]

    this.state = {
      username: '',
      userList: [],
      isMuted: false,
      isLeetSpeak: false,
    }
  }

  get activeUsers() {
    return this.state.userList.map(prop('name'))
  }

  stateWillUpdate(nextState) {
    if (this.state.isMuted !== nextState.isMuted) {
      Print.mutedStatus(nextState.isMuted)
    }

    if (this.state.isLeetSpeak !== nextState.isLeetSpeak) {
      Print.leetSpeakStatus(nextState.isLeetSpeak)
    }
  }

  start() {
    Print.homeScreen()
      .then(() => this.connect())
      .then(() => this.listen())
      .then(() => this.login())
      .then(() => this.prompt())
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket.on('connect', (err) => {
        if (err) reject()
        else resolve()
      })
    })
      .then(() => this.onConnect())
  }

  login() {
    return Print.loginPrompt()
      .then(username => this.onLogin(username))
  }

  prompt() {
    return Print.messagePrompt(this.state.username)
      .then(message => this.onSendNewMessage(message))
      .then(() => this.prompt())
  }

  listen() {
    this.socket.on('message', message => this.onReceiveMessage(message))
    this.socket.on('say_message', message => this.onReceiveSayMessage(message))
    this.socket.on('user_join', user => this.onUserJoin(user))
    this.socket.on('user_leave', user => this.onUserLeave(user))
    this.socket.on('user_list_update', users => this.onUserListUpdate(users))
  }

  onToggleMute() {
    this.setState({ isMuted: !this.state.isMuted })
  }

  onToggleLeetSpeak() {
    this.setState({ isLeetSpeak: !this.state.isLeetSpeak })
  }

  onListUsers() {
    Print.activeUsers(this.activeUsers)
  }

  onReceiveMessage(msg) {
    if (!this.state.isMuted) {
      Notification.messageReceived(msg)
    }

    Print.message(msg)
  }

  onReceiveSayMessage(msg) {
    if (!this.state.isMuted) {
      Notification.messageReceived(msg)
      Audio.say(msg.message, msg.voice)
    }

    Print.message(msg)
  }

  onUserJoin(username) {
    Print.userJoined(username)
  }

  onUserLeave(username) {
    Print.userLeft(username)
  }

  onUserListUpdate(userList) {
    this.setState({ userList })
  }

  onConnect() {
    return Print.connectionSuccess()
  }

  onLogin(username) {
    this.setState({ username })

    return Print.welcome(username)
      .then(() => Print.help(this.commands))
      .then(() => this.emitJoinRoom())
  }

  onSendNewMessage(message) {
    const handler =
      this.commands
        .reduce((acc, { test, name, parse = (x => x), handler }) =>
          !!acc || !message.match(test)
            ? acc
            : msg => handler(parse(msg))
        , false)

    if (handler) return Promise.resolve(handler(message))
    return this.emitMessage(message)
  }

  convertMessage(message) {
    if (isImageUrl(message)) {
      return toAscii(message).then(converted => `\n${converted}`)
    } else if (this.state.isLeetSpeak) {
      return Promise.resolve(convertTo1337(message))
    }

    return Promise.resolve(message)
  }

  formatMessage(message) {
    return {
      message,
      username: this.state.username
    }
  }

  emitMessage(message) {
    return this.convertMessage(message)
      .then(msg => this.formatMessage(msg))
      .then(msg => {
        this.socket.emit('message', msg)

        Print.myMessage(msg)
      })
  }

  emitSayMessage({ message, voice }) {
    const msg = {
      message,
      username: this.state.username,
      voice,
    }

    this.socket.emit('say_message', msg)

    Audio.say(msg.message, msg.voice)
    Print.myMessage(msg)
  }

  emitJoinRoom() {
    this.socket.emit('user_join', this.state.username)
    return Promise.resolve()
  }

}

module.exports = App
