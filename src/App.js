const io = require('socket.io-client')
const figlet = require('figlet')
const { has, prop, drop, head } = require('lodash/fp')
const { convertTo1337 } = require('./utils/1337')
const { toAscii, asciiImage, parseEmojis } = require('./utils/ascii')
const { isImageUrl } = require('./utils/url')
const { noOp } = require('./utils/misc')
const emojis = require('./assets/data/emojis.json')
const Print = require('./services/Print')
const Notification = require('./services/Notification')
const Audio = require('./services/Audio')
const State = require('./State')


const isDev = process.env.NODE_ENV === 'development'


class App extends State {
  constructor(serverUrl) {
    super()

    this.socket = io(serverUrl)

    this.commands = [
      {
        name: '/help',
        description: 'to list all commands available.',
        test: /^\/help$/,
        handler: this.onShowHelp.bind(this),
      },
      {
        name: '/mute',
        description: 'to mute or unmute the notification when a new message is received.',
        test: /^\/mute$/,
        handler: this.onToggleMute.bind(this),
      },
      {
        name: '/users',
        description: 'to display the list of all connected users.',
        test: /^\/users?$/,
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
        description: `to send a message in speech synthesizer mode.`,
        test: /^\/say\s[\w\.\s\|\']+$/,
        parse: msg => ({
          message: head(msg.replace('/say ', '').split('|')).trim(),
          voice: (msg.split('|')[1] || '').trim()
        }),
        handler: this.emitSayMessage.bind(this),
      },
      {
        name: '/voices',
        description: `to list all the voices available with /say command.`,
        test: /^\/voices?$/,
        handler: this.onListVoices.bind(this),
      },
      {
        name: '/emojis',
        description: 'list all ascii emojis available.',
        test: /^\/emojis?$/,
        handler: this.onListEmojis.bind(this),
      },
      {
        name: '/+1',
        description: 'to print a beautiful ASCII thumb up!',
        test: /^\/\+1$/,
        handler: this.emitMessage.bind(this, asciiImage.thumbUp),
      },
      {
        name: '/lollypop',
        description: 'to print an amazing ASCII lollypop!!',
        test: /^\/lollypop$/,
        handler: this.emitMessage.bind(this, asciiImage.lollypop),
      },
      {
        name: '/rock',
        description: 'to print an incredible ASCII metalish rock image!!',
        test: /^\/rock$/,
        handler: this.emitMessage.bind(this, asciiImage.rock),
      },
      {
        name: '/lourd',
        description: 'l\'Ascii c\'est lourd.',
        test: /^\/lourd$/,
        handler: this.emitMessage.bind(this, asciiImage.lourd),
      },
      {
        name: '/big <message>',
        description: 'to print a BIG ascii text. Must be under 30 character, though.',
        test: /^\/big\s.{1,30}$/,
        parse: msg => msg.replace('/big ', ''),
        handler: this.emitBigMessage.bind(this),
      },
      {
        name: '/img <url>',
        description: 'to print an ascii converted image. if your url ends in jpg, png or gif you can directly past it ;)',
        test: /^\/img\s.{1,255}$/,
        parse: msg => msg.replace('/img ', ''),
        handler: this.emitImageMessage.bind(this),
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

  onShowHelp() {
    return Print.help(this.commands)
  }

  onToggleMute() {
    return this.setState({ isMuted: !this.state.isMuted })
  }

  onToggleLeetSpeak() {
    return this.setState({ isLeetSpeak: !this.state.isLeetSpeak })
  }

  onListUsers() {
    return Print.activeUsers(this.activeUsers)
  }

  onListVoices() {
    return Print.availableVoices(Audio.voices)
  }

  onListEmojis() {
    return Print.availableEmojis(emojis)
  }

  onReceiveMessage(msg) {
    if (!this.state.isMuted) {
      Notification.messageReceived(msg)
    }

    return Print.message(msg)
  }

  onReceiveSayMessage(msg) {
    if (!this.state.isMuted) {
      Notification.messageReceived(msg)
      Audio.say(msg.message, msg.voice)
    }

    return Print.sayMessage(msg)
  }

  onUserJoin(username) {
    Notification.userJoined(username)
    return Print.userJoined(username)
  }

  onUserLeave(username) {
    Notification.userLeft(username)
    return Print.userLeft(username)
  }

  onUserListUpdate(userList) {
    return this.setState({ userList })
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

    return Promise.resolve(parseEmojis(message))
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
    return Print.mySayMessage(msg)
  }

  emitBigMessage(message) {
    return this.emitMessage(`\n${figlet.textSync(message, { horizontalLayout: 'full' })}`)
  }

  emitImageMessage(url) {
    return toAscii(url)
      .then(converted => `\n${converted}`)
      .then(msg => this.emitMessage(msg))
      .catch(
        isDev
          ? err => console.log('emitMessage error :', err)
          : noOp
      )
  }

  emitJoinRoom() {
    this.socket.emit('user_join', this.state.username)
    return Promise.resolve()
  }

}

module.exports = App
