const io = require('socket.io-client')
const axios = require('axios')
const figlet = require('figlet')
const { has, prop, drop, head, includes } = require('lodash/fp')
const { convertTo1337 } = require('./utils/1337')
const { toAscii, asciiImage, parseEmojis } = require('./utils/ascii')
const { isImageUrl } = require('./utils/url')
const { wait } = require('./utils/promise')
const { noOp } = require('./utils/misc')
const emojis = require('./assets/data/emojis.json')
const Print = require('./services/Print')
const Notification = require('./services/Notification')
const Audio = require('./services/Audio')
const State = require('./State')
const latestVersion = require('latest-version')
const packageInfo = require('../package.json')

const isDev = process.env.NODE_ENV === 'development'


class App extends State {
  constructor(serverUrl) {
    super()

    this.serverUrl = serverUrl
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
        name: '/rooms',
        description: 'to display the list of all available rooms.',
        test: /^\/rooms?$/,
        handler: this.onListRooms.bind(this),
      },
      {
        name: '#<room name> OR /join <room name>',
        description: 'to join an existing room, or create a new one.',
        test: /^((\/join\s)|#)[\w_-]{1,30}$/,
        parse: room => room.replace('/join ', '').replace(/^#/, ''),
        handler: this.onJoinRoom.bind(this),
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
        test: /^\/say\s.+$/,
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
        name: '/yeah',
        description: 'to say you like that, boldly.',
        test: /^\/yeah$/,
        handler: this.emitMessage.bind(this, asciiImage.yeah),
      },
      {
        name: '/up',
        description: 'to print an ASCII finger emoji pointing up.',
        test: /^\/up$/,
        handler: this.emitMessage.bind(this, asciiImage.up),
      },
      {
        name: '<3',
        description: 'to express your love.',
        test: /^<3$/,
        handler: this.emitMessage.bind(this, asciiImage.heart),
      },
      {
        name: '/big <message>',
        description: 'to print a BIG ASCII text. Must be under 30 characters, though.',
        test: /^\/big\s.{1,30}$/,
        parse: msg => msg.replace('/big ', ''),
        handler: this.emitBigMessage.bind(this),
      },
      {
        name: '/img <url or local path>',
        description: 'to print an ASCII converted image. if your url ends in jpg, png or gif you can directly past it ;)',
        test: /^\/img\s.{1,255}$/,
        parse: msg => msg.replace('/img ', ''),
        handler: this.emitImageMessage.bind(this),
      },
    ]

    this.state = {
      username: '',
      // User :: { name: String }
      userList: [],
      // Room :: { name: String, users: [User] }
      roomList: [],
      currentRoom: '',
      isMuted: false,
      isLeetSpeak: false,
      isFirstConnection: true,
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
      .then(() => this.listenToUpdates())
      .then(() => this.connect())
      .then(() => this.checkVersion())
      .then(() => this.login())
      .then(() => this.chooseRoom())
      .then(() => this.listenToMessages())
      .then(() => this.startUpdateUserInfo())
      .then(() => this.prompt())
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  }

  checkVersion() {
    const { version } = packageInfo
    return Print.appVersion(version)
      .then(() => latestVersion('ch4t'))
      .then(latestVersion =>
        latestVersion !== version
          ? Print.installLatestVersion(latestVersion)
          : Promise.resolve()
      )
  }

  connect() {
    return Print.connectionSpinner()
      .then(() => new Promise((resolve, reject) => {
        this.socket.on('connect', err => {
          if (err) return reject()
          return resolve()
        })
      }))
      .then(() => this.onConnect())
  }

  login() {
    return Print.loginPrompt(this.checkIfUsernameIsAvailable.bind(this))
      .then(username => this.onLogin(username))
  }

  checkIfUsernameIsAvailable(username) {
    return axios.post(`${this.serverUrl}/check-username`, { username })
      .then(res => res.data.isAvailable)
  }

  chooseRoom() {
    return Print.chooseRoomPrompt(this.state.roomList)
      .then(room => this.onJoinRoom(room))
  }

  startUpdateUserInfo() {
    this.updateUserInfo()
    return Promise.resolve()
  }

  updateUserInfo() {
    Promise.resolve(this.socket.emit('update_user_info', {
      username: this.state.username,
      roomName: this.state.currentRoom
    }))
      .then(() => wait(60000))
      .then(() => this.updateUserInfo())
  }

  prompt() {
    return Print.messagePrompt(this.state.username)
      .then(message => this.onSendNewMessage(message))
      .then(() => this.prompt())
  }

  listenToUpdates() {
    this.socket.on('user_list_update', users => this.onUserListUpdate(users))
    this.socket.on('room_list_update', rooms => this.onRoomListUpdate(rooms))
  }

  listenToMessages() {
    this.socket.on('message', message => this.onReceiveMessage(message))
    this.socket.on('say_message', message => this.onReceiveSayMessage(message))
    this.socket.on('user_join', user => this.onUserJoin(user))
    this.socket.on('user_leave', (user, userNextRoom) => this.onUserLeave(user, userNextRoom))
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

  onListRooms() {
    return Print.availableRooms(this.state.roomList)
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
        .catch(
          isDev
            ? err => console.log('Audio.say error :', err)
            : noOp
        )
    }

    return Print.sayMessage(msg)
  }

  onUserJoin(username) {
    if (!includes(username, this.activeUsers)) {
      Notification.userJoined(username)
      return Print.userJoined(username)
    }
    return Promise.resolve()
  }

  onUserLeave(username, userNextRoom) {
    if (includes(username, this.activeUsers)) {
      Notification.userLeft(username)
      return Print.userLeft(username, userNextRoom)
    }
    return Promise.resolve()
  }

  onUserListUpdate(userList) {
    return this.setState({ userList })
  }

  onRoomListUpdate(roomList) {
    return this.setState({ roomList })
  }

  onConnect() {
    return Print.connectionSuccess()
  }

  onLogin(username) {
    this.setState({ username })
    return this.emitLogin(username)
      .then(() => Print.welcome(username))
  }

  onJoinRoom(room) {
    this.setState({ currentRoom: room })
    return this.emitJoinRoom(room)
      .then(() => Print.joinRoom(room))
      .then(() => this.state.isFirstConnection
        ? Print.help(this.commands)
        : Promise.resolve()
      )
      .then(() => this.setState({ isFirstConnection: false }))
      .then(() => wait(300))
      .then(() => this.onListUsers())
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
      username: this.state.username,
      createdAt: Date.now(),
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
    const msg = Object.assign({}, this.formatMessage(message), { voice })

    this.socket.emit('say_message', msg)
    Audio.say(msg.message, msg.voice)
      .catch(
        isDev
          ? err => console.log('Audio.say error :', err)
          : noOp
      )

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

  emitLogin(username) {
    this.socket.emit('login', username)
    return Promise.resolve(username)
  }

  emitJoinRoom(room) {
    this.socket.emit('join_room', room)
    return Promise.resolve(room)
  }

}

module.exports = App
