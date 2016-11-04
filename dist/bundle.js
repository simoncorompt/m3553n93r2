#!/usr/bin/env node --harmony
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var App = __webpack_require__(2);
	var app = new App('https://m3553n93r2.herokuapp.com/');
	app.start();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var io = __webpack_require__(3);
	var figlet = __webpack_require__(4);

	var _require = __webpack_require__(5),
	    has = _require.has,
	    prop = _require.prop,
	    drop = _require.drop,
	    head = _require.head;

	var _require2 = __webpack_require__(6),
	    convertTo1337 = _require2.convertTo1337;

	var _require3 = __webpack_require__(7),
	    toAscii = _require3.toAscii,
	    asciiImage = _require3.asciiImage,
	    parseEmojis = _require3.parseEmojis;

	var _require4 = __webpack_require__(13),
	    isImageUrl = _require4.isImageUrl;

	var _require5 = __webpack_require__(14),
	    noOp = _require5.noOp;

	var emojis = __webpack_require__(12);
	var Print = __webpack_require__(15);
	var Notification = __webpack_require__(22);
	var Audio = __webpack_require__(25);
	var State = __webpack_require__(28);

	var isDev = process.env.NODE_ENV === 'development';

	var App = function (_State) {
	  _inherits(App, _State);

	  function App(serverUrl) {
	    _classCallCheck(this, App);

	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

	    _this.socket = io(serverUrl);

	    _this.commands = [{
	      name: '/help',
	      description: 'to list all commands available.',
	      test: /^\/help$/,
	      handler: _this.onShowHelp.bind(_this)
	    }, {
	      name: '/mute',
	      description: 'to mute or unmute the notification when a new message is received.',
	      test: /^\/mute$/,
	      handler: _this.onToggleMute.bind(_this)
	    }, {
	      name: '/users',
	      description: 'to display the list of all connected users.',
	      test: /^\/users?$/,
	      handler: _this.onListUsers.bind(_this)
	    }, {
	      name: '/1337',
	      description: 'to toggle the leetSpe4k mode 1!!1!1!',
	      test: /^\/1337$/,
	      handler: _this.onToggleLeetSpeak.bind(_this)
	    }, {
	      name: '/say <message> | <voice>',
	      description: 'to send a message in speech synthesizer mode.',
	      test: /^\/say\s[\w\.\s\|\']+$/,
	      parse: function parse(msg) {
	        return {
	          message: head(msg.replace('/say ', '').split('|')).trim(),
	          voice: (msg.split('|')[1] || '').trim()
	        };
	      },
	      handler: _this.emitSayMessage.bind(_this)
	    }, {
	      name: '/voices',
	      description: 'to list all the voices available with /say command.',
	      test: /^\/voices?$/,
	      handler: _this.onListVoices.bind(_this)
	    }, {
	      name: '/emojis',
	      description: 'list all ascii emojis available.',
	      test: /^\/emojis?$/,
	      handler: _this.onListEmojis.bind(_this)
	    }, {
	      name: '/+1',
	      description: 'to print a beautiful ASCII thumb up!',
	      test: /^\/\+1$/,
	      handler: _this.emitMessage.bind(_this, asciiImage.thumbUp)
	    }, {
	      name: '/lollypop',
	      description: 'to print an amazing ASCII lollypop!!',
	      test: /^\/lollypop$/,
	      handler: _this.emitMessage.bind(_this, asciiImage.lollypop)
	    }, {
	      name: '/yeah',
	      description: 'to say you like that, boldly.',
	      test: /^\/rock$/,
	      handler: _this.emitMessage.bind(_this, asciiImage.rock)
	    }, {
	      name: '/up',
	      description: 'to print an ASCII finger emoji pointing up.',
	      test: /^\/lourd$/,
	      handler: _this.emitMessage.bind(_this, asciiImage.lourd)
	    }, {
	      name: '/big <message>',
	      description: 'to print a BIG ASCII text. Must be under 30 character, though.',
	      test: /^\/big\s.{1,30}$/,
	      parse: function parse(msg) {
	        return msg.replace('/big ', '');
	      },
	      handler: _this.emitBigMessage.bind(_this)
	    }, {
	      name: '/img <url or local path>',
	      description: 'to print an ASCII converted image. if your url ends in jpg, png or gif you can directly past it ;)',
	      test: /^\/img\s.{1,255}$/,
	      parse: function parse(msg) {
	        return msg.replace('/img ', '');
	      },
	      handler: _this.emitImageMessage.bind(_this)
	    }];

	    _this.state = {
	      username: '',
	      userList: [],
	      isMuted: false,
	      isLeetSpeak: false
	    };
	    return _this;
	  }

	  _createClass(App, [{
	    key: 'stateWillUpdate',
	    value: function stateWillUpdate(nextState) {
	      if (this.state.isMuted !== nextState.isMuted) {
	        Print.mutedStatus(nextState.isMuted);
	      }

	      if (this.state.isLeetSpeak !== nextState.isLeetSpeak) {
	        Print.leetSpeakStatus(nextState.isLeetSpeak);
	      }
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this2 = this;

	      Print.homeScreen().then(function () {
	        return _this2.connect();
	      }).then(function () {
	        return _this2.listen();
	      }).then(function () {
	        return _this2.login();
	      }).then(function () {
	        return _this2.prompt();
	      }).catch(function (err) {
	        console.error(err);
	        process.exit(1);
	      });
	    }
	  }, {
	    key: 'connect',
	    value: function connect() {
	      var _this3 = this;

	      return new Promise(function (resolve, reject) {
	        _this3.socket.on('connect', function (err) {
	          if (err) reject();else resolve();
	        });
	      }).then(function () {
	        return _this3.onConnect();
	      });
	    }
	  }, {
	    key: 'login',
	    value: function login() {
	      var _this4 = this;

	      return Print.loginPrompt().then(function (username) {
	        return _this4.onLogin(username);
	      });
	    }
	  }, {
	    key: 'prompt',
	    value: function prompt() {
	      var _this5 = this;

	      return Print.messagePrompt(this.state.username).then(function (message) {
	        return _this5.onSendNewMessage(message);
	      }).then(function () {
	        return _this5.prompt();
	      });
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      var _this6 = this;

	      this.socket.on('message', function (message) {
	        return _this6.onReceiveMessage(message);
	      });
	      this.socket.on('say_message', function (message) {
	        return _this6.onReceiveSayMessage(message);
	      });
	      this.socket.on('user_join', function (user) {
	        return _this6.onUserJoin(user);
	      });
	      this.socket.on('user_leave', function (user) {
	        return _this6.onUserLeave(user);
	      });
	      this.socket.on('user_list_update', function (users) {
	        return _this6.onUserListUpdate(users);
	      });
	    }
	  }, {
	    key: 'onShowHelp',
	    value: function onShowHelp() {
	      return Print.help(this.commands);
	    }
	  }, {
	    key: 'onToggleMute',
	    value: function onToggleMute() {
	      return this.setState({ isMuted: !this.state.isMuted });
	    }
	  }, {
	    key: 'onToggleLeetSpeak',
	    value: function onToggleLeetSpeak() {
	      return this.setState({ isLeetSpeak: !this.state.isLeetSpeak });
	    }
	  }, {
	    key: 'onListUsers',
	    value: function onListUsers() {
	      return Print.activeUsers(this.activeUsers);
	    }
	  }, {
	    key: 'onListVoices',
	    value: function onListVoices() {
	      return Print.availableVoices(Audio.voices);
	    }
	  }, {
	    key: 'onListEmojis',
	    value: function onListEmojis() {
	      return Print.availableEmojis(emojis);
	    }
	  }, {
	    key: 'onReceiveMessage',
	    value: function onReceiveMessage(msg) {
	      if (!this.state.isMuted) {
	        Notification.messageReceived(msg);
	      }

	      return Print.message(msg);
	    }
	  }, {
	    key: 'onReceiveSayMessage',
	    value: function onReceiveSayMessage(msg) {
	      if (!this.state.isMuted) {
	        Notification.messageReceived(msg);
	        Audio.say(msg.message, msg.voice);
	      }

	      return Print.sayMessage(msg);
	    }
	  }, {
	    key: 'onUserJoin',
	    value: function onUserJoin(username) {
	      Notification.userJoined(username);
	      return Print.userJoined(username);
	    }
	  }, {
	    key: 'onUserLeave',
	    value: function onUserLeave(username) {
	      Notification.userLeft(username);
	      return Print.userLeft(username);
	    }
	  }, {
	    key: 'onUserListUpdate',
	    value: function onUserListUpdate(userList) {
	      return this.setState({ userList: userList });
	    }
	  }, {
	    key: 'onConnect',
	    value: function onConnect() {
	      return Print.connectionSuccess();
	    }
	  }, {
	    key: 'onLogin',
	    value: function onLogin(username) {
	      var _this7 = this;

	      this.setState({ username: username });

	      return Print.welcome(username).then(function () {
	        return Print.help(_this7.commands);
	      }).then(function () {
	        return _this7.emitJoinRoom();
	      });
	    }
	  }, {
	    key: 'onSendNewMessage',
	    value: function onSendNewMessage(message) {
	      var handler = this.commands.reduce(function (acc, _ref) {
	        var test = _ref.test,
	            name = _ref.name,
	            _ref$parse = _ref.parse,
	            parse = _ref$parse === undefined ? function (x) {
	          return x;
	        } : _ref$parse,
	            handler = _ref.handler;
	        return !!acc || !message.match(test) ? acc : function (msg) {
	          return handler(parse(msg));
	        };
	      }, false);

	      if (handler) return Promise.resolve(handler(message));
	      return this.emitMessage(message);
	    }
	  }, {
	    key: 'convertMessage',
	    value: function convertMessage(message) {
	      if (isImageUrl(message)) {
	        return toAscii(message).then(function (converted) {
	          return '
' + converted;
	        });
	      } else if (this.state.isLeetSpeak) {
	        return Promise.resolve(convertTo1337(message));
	      }

	      return Promise.resolve(parseEmojis(message));
	    }
	  }, {
	    key: 'formatMessage',
	    value: function formatMessage(message) {
	      return {
	        message: message,
	        username: this.state.username
	      };
	    }
	  }, {
	    key: 'emitMessage',
	    value: function emitMessage(message) {
	      var _this8 = this;

	      return this.convertMessage(message).then(function (msg) {
	        return _this8.formatMessage(msg);
	      }).then(function (msg) {
	        _this8.socket.emit('message', msg);
	        Print.myMessage(msg);
	      });
	    }
	  }, {
	    key: 'emitSayMessage',
	    value: function emitSayMessage(_ref2) {
	      var message = _ref2.message,
	          voice = _ref2.voice;

	      var msg = {
	        message: message,
	        username: this.state.username,
	        voice: voice
	      };

	      this.socket.emit('say_message', msg);
	      Audio.say(msg.message, msg.voice);
	      return Print.mySayMessage(msg);
	    }
	  }, {
	    key: 'emitBigMessage',
	    value: function emitBigMessage(message) {
	      return this.emitMessage('
' + figlet.textSync(message, { horizontalLayout: 'full' }));
	    }
	  }, {
	    key: 'emitImageMessage',
	    value: function emitImageMessage(url) {
	      var _this9 = this;

	      return toAscii(url).then(function (converted) {
	        return '
' + converted;
	      }).then(function (msg) {
	        return _this9.emitMessage(msg);
	      }).catch(isDev ? function (err) {
	        return console.log('emitMessage error :', err);
	      } : noOp);
	    }
	  }, {
	    key: 'emitJoinRoom',
	    value: function emitJoinRoom() {
	      this.socket.emit('user_join', this.state.username);
	      return Promise.resolve();
	    }
	  }, {
	    key: 'activeUsers',
	    get: function get() {
	      return this.state.userList.map(prop('name'));
	    }
	  }]);

	  return App;
	}(State);

	module.exports = App;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("socket.io-client");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("figlet");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash/fp");

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var convertTo1337 = function convertTo1337(str) {
	  return str.split('').map(to1337).join('');
	};

	var leetMap = {
	  'a': '4',
	  'e': '3',
	  'g': '9',
	  't': '7',
	  'i': '1',
	  'o': '0'
	};

	var to1337 = function to1337(char) {
	  return leetMap[char.toLowerCase()] || char;
	};

	module.exports = {
	  convertTo1337: convertTo1337
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var fs = __webpack_require__(8);
	var path = __webpack_require__(9);
	var request = __webpack_require__(10);
	var imageToAscii = __webpack_require__(11);
	var emojis = __webpack_require__(12);

	var _require = __webpack_require__(13),
	    isImageUrl = _require.isImageUrl,
	    extractImageFullName = _require.extractImageFullName;

	var fileExists = function fileExists(filePath) {
	  return new Promise(function (resolve, reject) {
	    var parsed = filePath.replace(/\/g, '');
	    if (fs.existsSync(parsed)) return resolve(parsed);
	    return reject(filePath);
	  });
	};

	var downloadImage = function downloadImage(url) {
	  return new Promise(function (resolve, reject) {
	    if (!isImageUrl(url)) return reject(new Error('dowloadImage error : not a valid image url'));

	    var imageName = extractImageFullName(url);
	    var filePath = path.resolve(__dirname, '..', '..', 'files', imageName);

	    request(url).pipe(fs.createWriteStream(filePath)).on('close', function (err) {
	      if (err) return reject(err);
	      resolve(filePath);
	    });
	  });
	};

	var toAscii = function toAscii(url) {
	  return fileExists(url).then(function (f) {
	    return f;
	  }, downloadImage).then(function (filePath) {
	    return imageToAscii(filePath, { fit: 'box', height: 40 });
	  });
	};

	var parseEmojis = function parseEmojis(str) {
	  return str.split(' ').map(function (x) {
	    return emojis[x] || x;
	  }).join(' ');
	};

	var thumbUp = '

          /(|
         (  :
        __\  \  _____
      (____)  `|
     (____)|   |
      (____).__|
       (___)__.|_____

';

	var lollypop = '

      ,-""-.
     :======:
     :======;
      `-.,-\'
        ||
      _,\'\'--.    _____
     (/ __   `._|
    ((_/_)\     |
     (____)`.___|
      (___)____.|_____

';

	var rock = '

                              __
                             /  \
                            |    |
              _             |    |
           /\'  |            | _  |
           |   |            |    |
           | _ |            |    |
           |   |            |    |
           |   |        __  | _  |
           | _ |  __   /  \ |    |
           |   | /  \ |    ||    |
           |   ||    ||    ||    |       _---.
           |   ||    ||    |. __ |     ./     |
           | _. | -- || -- |    `|    /      //
           |\'   |    ||    |     |   /`     (/
           |    |    ||    |     | ./       /
           |    |.--.||.--.|  __ |/       .|
           |  __|    ||    |-\'            /
           |-\'   \__/  \__/             .|
           |       _.-\'                 /
           |   _.-\'      /             |
           |            /             /
           |           |             /
           `           |            /
           \          |          /\'
           |          `        /
           \                .\'
           |                |
           |                |
           |                |
           |                |

';

	var lourd = '

                    .--.
                   /    \
                   |    |
                   |    |
                   |  _ |
                   |    |
                   |    |
                   |    |
                   |  _ |
                   |    |
             .--.  |    |
            /    \/     |
         .-<.     \     |
        /    \     \    _\_
        |     \     \.-\')  `.
      .-L.     \     \-\'     \
     /    \     \  .\')    ,-  \
     |     \     \`-\' `--\     \
     | (    \  .\')   /    `.   |
     | _\    \`-\'   /          |
     \   \  .\')               /
      \   `--\'     /         /
       \           |        /
        \                 .\'
         \          _ .  /
          \ _ . - \'      |
          |              |
          |              |

';

	module.exports = {
	  toAscii: toAscii,
	  parseEmojis: parseEmojis,
	  asciiImage: {
	    thumbUp: thumbUp,
	    lollypop: lollypop,
	    rock: rock,
	    lourd: lourd
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("asciify-image");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		":fish:": "><(((('>",
		":fish2:": "¸.·´¯`·.´¯`·.¸¸.·´¯`·.¸><(((º>",
		":fish3:": ">-<==^=:>",
		":house:": "__̴ı̴̴̡̡̡ ̡͌l̡̡̡ ̡͌l̡*̡̡ ̴̡ı̴̴̡ ̡̡͡|̲̲̲͡͡͡ ̲▫̲͡ ̲̲̲͡͡π̲̲͡͡ ̲̲͡▫̲̲͡͡ ̲|̡̡̡ ̡ ̴̡ı̴̡̡ ̡͌l̡̡̡̡.___",
		":care_crowd:": "(-(-_(-_-)_-)-)",
		":monster:": "٩(̾●̮̮̃̾•̃̾)۶",
		":monster2:": "٩(- ̮̮̃-̃)۶",
		":boombox:": "♫♪.ılılıll|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|llılılı.♫♪",
		":butterfly:": "Ƹ̵̡Ӝ̵̨̄Ʒ",
		":finger:": "╭∩╮(Ο_Ο)╭∩╮",
		":finger2:": "┌∩┐(◣_◢)┌∩┐",
		":crayons:": "((̲̅ ̲̅(̲̅C̲̅r̲̅a̲̅y̲̅o̲̅l̲̲̅̅a̲̅( ̲̅((>",
		":pistols:": "¯¯̿̿¯̿̿'̿̿̿̿̿̿̿'̿̿'̿̿̿̿̿'̿̿̿)͇̿̿)̿̿̿̿ '̿̿̿̿̿̿\̵͇̿̿\=(•̪̀●́)=o/̵͇̿̿/'̿̿ ̿ ̿̿",
		":heart:": "♡",
		":heart2:": "»-(¯`·.·´¯)->",
		":mouse:": "~~(__^·>",
		":mouse2:": "----{,_,\">",
		":worm:": "_/\__/\__0>",
		":worm2:": "~",
		":koala:": "@( * O * )@",
		":monkey:": "@('_')@",
		":monkey2:": "{:{|}",
		":waves:": "°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸",
		":waves2:": "(¯`·._.·(¯`·._.·(¯`·._.··._.·´¯)·._.·´¯)·._.·´¯)",
		":glasses:": "ᒡ◯ᵔ◯ᒢ",
		":rose:": "--------{---(@",
		":rose2:": "{இ}ڿڰۣ-ڰۣ~—",
		":rose3:": "@}}>-----",
		":stars_in_my_eyes:": "<*_*>",
		":looking_face:": "ô¿ô",
		":sleeping:": "(-.-)Zzz...",
		":sleeping_baby:": "[{-_-}] ZZZzz zz z...",
		":love_you:": "ℓ٥ﻻ ﻉ√٥υ",
		":love_you2:": "ᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ ᶫᵒᵛᵉᵧₒᵤᶫᵒᵛᵉᵧₒᵤ",
		":pistols2:": "̿' ̿'\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿",
		":knife:": ")xxxxx[;;;;;;;;;>",
		":coffee:": "c[_]",
		":robot:": "d[ o_0 ]b",
		":robot2:": "<|º감º|>",
		":pig:": "^(*(oo)*)^",
		":pig2:": "༼☉ɷ⊙༽",
		":needle:": "|==|iiii|>-----",
		":needle2:": "[ ]--[\"\"\"\"\"|\"\"\"\"\"|\"\"\"\"\"|\"\"\"\"\"|]>----------",
		":cat:": "龴ↀ◡ↀ龴",
		":cat2:": "=^..^=",
		":cat3:": "(,,,)=(^.^)=(,,,)",
		":cat4:": "^ↀᴥↀ^",
		":sword:": "(===||:::::::::::::::>",
		":sword2:": "ס₪₪₪₪§|(Ξ≥≤≥≤≥≤ΞΞΞΞΞΞΞΞΞΞ>",
		":sword3:": "o()xxxx[{::::::::::::::::::::::::::::::::::>",
		":sword4:": "@xxxx[{::::::::::::::::::::::::::::::::::>",
		":sword5:": "@()xxx[{:::\":::\":::\":::\":::\":::\":::=>",
		":sword6:": "()==[:::::::::::::>",
		":rock_on:": "\,,/(^_^)\,,/",
		":caterpillar:": ",/\,/\,/\,/\,/\,/\,o",
		":caterpillar2:": "(,(,(,(,(,(,(,(, \")",
		":swords:": "▬▬ι═══════ﺤ -═══════ι▬▬",
		":professor:": "'''⌐(ಠ۾ಠ)¬'''",
		":sad:": "ε(´סּ︵סּ`)з",
		":sad2:": "(╥﹏╥)",
		":sad3:": "(✖╭╮✖)",
		":airplane:": "‛¯¯٭٭¯¯(▫▫)¯¯٭٭¯¯’",
		":airplane2:": "✈",
		":cassette:": "[¯ↂ■■ↂ¯]",
		":car_race:": "∙،°. ˘Ô≈ôﺣ » » »",
		":happy:": "ۜ\(סּںסּَ` )/ۜ",
		":happy2:": "⎦˚◡˚⎣",
		":bender:": "¦̵̱ ̵̱ ̵̱ ̵̱ ̵̱(̢ ̡͇̅└͇̅┘͇̅ (▤8כ−◦",
		":fish_invasion:": "›(̠̄:̠̄c ›(̠̄:̠̄c (¦Ҝ (¦Ҝ ҉ - - - ¦̺͆¦ ▪▌",
		":love_face:": "(♥_♥)",
		":face:": "•|龴◡龴|•",
		":face2:": "☜Ҩ.¬_¬.Ҩ☞",
		":big_nose:": "˚∆˚",
		":big_eyes:": "⺌∅‿∅⺌",
		":sunny_day:": "☁ ▅▒░☼‿☼░▒▅ ☁",
		":woman:": "▓⚗_⚗▓",
		":dog:": "ˁ˚ᴥ˚ˀ",
		":stars:": "✌⊂(✰‿✰)つ✌",
		":stars2:": "⋆ ✢ ✣ ✤ ✥ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ★",
		":hairstyle:": "⨌⨀_⨀⨌",
		":eyes:": "℃ↂ_ↂↃ",
		":cat_face:": "⦿⽘⦿",
		":cute_cat:": "^⨀ᴥ⨀^",
		":nose:": "\˚ㄥ˚\",
		":nose2:": "|'L'|",
		":pirate:": "✌(◕‿-)✌",
		":human:": "•͡˘㇁•͡˘",
		":awesome:": "<:3 )~~~",
		":happy_birthday_1:": "ዞᏜ℘℘Ꮍ ℬℹℛʈዞᗬᏜᎽ",
		":musical:": "¸¸♬·¯·♩¸¸♪·¯·♫¸¸Happy Birthday To You¸¸♬·¯·♩¸¸♪·¯·♫¸¸",
		":dunno:": "¯\_(ツ)_/¯",
		":dagger:": "cxxx|;:;:;:;:;:;:;:;>",
		":table_flip:": "(╯°□°）╯︵ ┻━┻",
		":mis_mujeres:": "(-(-_(-_-)_-)-)",
		":linqan:": ":Q___",
		":eye_closed:": "(╯_╰)",
		":in_love:": "(✿ ♥‿♥)",
		":cry:": "(╯︵╰,)",
		":line_brack:": "●▬▬▬▬๑۩۩๑▬▬▬▬▬●",
		":$:": "[̲̅$̲̅(̲̅ιοο̲̅)̲̅$̲̅]",
		":med:": "ب_ب",
		":help:": "٩(͡๏̯͡๏)۶",
		":birds‏:": "~(‾▿‾)~",
		":hell_yeah:": "(òÓ,)_\,,/",
		":bullshit:": "|3ᵕᶦᶦᶳᶣᶨᶵ",
		":dick:": "8======D",
		":finger3:": "‹^› ‹(•_•)› ‹^›",
		":melp:": "(<>..<>)",
		":melp2:": "(<(<>(<>.(<>..<>).<>)<>)>)",
		":homer:": "( (8 ())",
		":homer2:": "(_8(|)",
		":homer3:": "(_8^(J)",
		":gun:": "(⌐■_■)--︻╦╤─ - - -",
		":gun2:": "▄︻̷̿┻̿═━一",
		":happy_square:": "【ツ】",
		":snowman:": "☃",
		":snowman2:": "☃",
		":guitar:": "c====(=#O| ) ~~ ♬·¯·♩¸¸♪·¯·♫¸",
		":guitar2:": "{ o }===(:::)",
		":i_kill_you:": "̿ ̿̿'̿̿\̵͇̿̿\=(•̪●)=/̵͇̿̿/'̿̿ ̿ ̿",
		":kirby_dance:": "<(''<) <( ' ' )> (> '')>",
		":cigarette:": "(____((____________()~~~",
		":rocket:": "∙∙∙∙∙·▫▫ᵒᴼᵒ▫ₒₒ▫ᵒᴼᵒ▫ₒₒ▫ᵒᴼᵒ☼)===>",
		":jaymz:": "(•̪●)==ε/̵͇̿​̿/’̿’̿ ̿ ̿̿ `(•.°)~",
		":ghost:": "‹’’›(Ͼ˳Ͽ)‹’’›",
		":bird:": "(⌒▽⌒)﻿",
		":chainsword:": "|O/////[{:;:;:;:;:;:;:;:;>",
		":elephant:": "°j°m",
		":boobies:": "(. )( .)",
		":dancing:": "‎(/.__.)/ \(.__.\)",
		":people2:": "٩(̾●̮̮̃̾•̃̾)۶٩(̾●̮̮̃̾•̃̾)۶٩(̾●̮̮̃̾•̃̾)۶٩(̾●̮̮̃̾•̃̾)۶٩(̾●̮̮̃̾•̃̾)۶٩(̾●̮̮̃̾•̃̾)۶",
		":rapier:": "Ø)xxxxx[╣╗╗╕╕╕=======────────────",
		":pictou:": "|\_______(#*#)_______/|",
		":hal:": "@_'-'",
		":rose4:": "@}~}~~~",
		":headphones:": "d[-_-]b",
		":sat:": "'(◣_◢)'",
		":cthulhu:": "^(;,;)^",
		":polar_bear:": "ˁ˚ᴥ˚ˀ",
		":long_rose:": "---------------------{{---<((@)",
		":robot_boy:": "◖(◣☩◢)◗",
		":up:": "(◔/‿\◔)",
		":med_man:": "(⋗_⋖)",
		":charly:": "+:)",
		":angry:": "ლ(ಠ益ಠ)ლ",
		":angry2:": "┌∩┐(⋟﹏⋞)┌∩┐",
		":train:": "/˳˳_˳˳\!˳˳X˳˳!(˳˳_˳˳)[˳˳_˳˳]",
		":rainbow_dash_so_awesome:": "/)^3^(\",
		":spot:": "( . Y . )",
		":zoidberg:": "(\/)(Ö,,,,Ö)(\/)",
		":zoidberg2:": "(\/) (;,,;) (\/)",
		":what:": "ة_ة",
		":what2:": "ლ(ಠ益ಠლ)╯",
		":westbound_fish:": "< )))) ><",
		":eastbound_fish:": "><((((>",
		":telephone:": "ε(๏_๏)з】",
		":king:": "-_-",
		":fuck_you:": "nlm (-_-) mln",
		":fuck_you2:": "ᶠᶸᶜᵏ♥ᵧₒᵤ",
		":spear:": ">>-;;;------;;-->",
		":serious:": "(ಠ_ಠ)",
		":tron:": "(\/)(;,,;)(\/)",
		":roke:": "_\m/",
		":thisisareku:": "d(^o^)b",
		":thanks:": "\(^-^)/",
		":dalek:": "̵̄/͇̐\",
		":lenny:": "( ͡° ͜ʖ ͡°)﻿",
		":sean_the_sheep:": "<('--')>",
		":love:": ":} <3 {:",
		":love2:": "ⓛⓞⓥⓔ",
		":love3:": "~♡ⓛⓞⓥⓔ♡~",
		":y_u_no_copy_me:": "(ノಠ益ಠ)ノ彡",
		":party_time:": "┏(-_-)┛┗(-_-﻿ )┓┗(-_-)┛┏(-_-)┓",
		":fox:": "-^^,--,~",
		":angry_face:": "(⋟﹏⋞)",
		":slenderman:": "ϟƖΣNd€RMαN",
		":he_has_a_gun:": "(╯°□°)--︻╦╤─ - - -",
		":lenny_face:": "( ͡° ͜ʖ ͡°)",
		":gabriel:": "\,,/.<(*_*)> live long and prosper",
		":john_lennon:": "((ºjº))",
		":peace_yo:": "(‾⌣‾)♉",
		":haha:": "٩(^‿^)۶",
		":sparkling_heart:": "-`ღ´-",
		":sparkling_heart2:": "-`ღ´-",
		":punch!!:": "O=('-'Q)",
		":kablewee:": "̿' ̿'\̵͇̿̿\з=( ͡ °_̯͡° )=ε/̵͇̿̿/'̿'̿ ̿",
		":singing:": "d(^o^)b¸¸♬·¯·♩¸¸♪·¯·♫¸¸",
		":ak47_gun:": "︻デ═一",
		":nice_boobs:": "(.)(.)",
		":russian_boobs:": "[.][.]",
		":monocle:": "ಠ_ರೃ",
		":fuck_off:": "t(-.-t)",
		":butt:": "( o) ( o) - - - - - - (__(__)",
		":atish:": "(| - _ - |)",
		":sperm:": "~~o",
		":shark_attack:": "~~~~~~~~*\o/~~~~~/\*~~~~~~~",
		":teddy:": "ˁ(⦿ᴥ⦿)ˀ",
		":tears:": "ಥ_ಥ",
		":robber:": "-╤╗_(◙◙)_╔╤- - - - \o/ \o/ \o/",
		":playing_cards:": "[♥]]] [♦]]] [♣]]] [♠]]]",
		":facepalm:": "(>ლ)",
		":snowing:": "✲´*。.❄¨¯`*✲。❄。*。¨¯`*✲",
		":decorate:": "▂▃▅▇█▓▒░۩۞۩ ۩۞۩░▒▓█▇▅▃▂",
		":run:": "|''''''''''''::::===   - - - - - - - - -   ‘0’/",
		":badass:": "(⌐■_■)--︻╦╤─ - - -",
		":trumpet:": "o--|||---<|",
		":trumpet2:": "-=iii=<()",
		":pingpong:": "( •_•)O*¯`·.¸.·´¯`°Q(•_• )",
		":pingpong2:": "( '_')0*´¯`·.¸.·´¯`°Q('_' )",
		":sky_free:": "ѧѦ ѧ ︵͡︵ ̢ ̱ ̧̱ι̵̱̊ι̶̨̱ ̶̱ ︵ Ѧѧ ︵͡ ︵ ѧ Ѧ ̵̗̊o̵̖ ︵ ѦѦ ѧ",
		":sex_symbol:": "◢♂◣◥♀◤◢♂◣◥♀◤",
		":barbell:": "▐▬▬▬▌",
		":barbell2:": "▐━━━━━▌",
		":flip_table:": "┻━┻︵ \(°□°)/ ︵ ┻━┻",
		":being_draged:": "╰(◣﹏◢)╯",
		":eric:": ">--) ) ) )*>",
		":beach_bugalow:": "|̲̲̲͡͡͡ ̲▫̲͡ ̲̲̲͡͡π̲̲͡͡ ̲̲͡▫̲̲͡͡ ̲|̡̡̡ ̡ ̴̡ı̴̡̡ ̡͌l̡ ̴̡ı̴̴̡ ̡l̡*̡̡ ̴̡ı̴̴̡ ̡̡͡|̲̲̲͡͡͡ ̲▫̲͡ ̲̲̲͡͡π̲̲͡͡ ̲̲͡▫̲̲͡͡ |",
		":possessed/disapproval:": "<>_<>",
		":puls:": "––•–√\/––√\/––•––",
		":sniper_rifle:": "︻デ┳═ー",
		":scissors:": "✄",
		":jokeranonimous:": "╭∩╮ (òÓ,) ╭∩╮",
		":jokeranonimous2:": "╭∩╮(ô¿ô)╭∩╮",
		":zombie:": "'º_º'",
		":zombie2:": "∩ ∩♀-∩- - - -═╦═╗",
		":chair:": "╦╣",
		":monocle_guy:": "(c ͡|Q ͜ʖ ͡o)-c[_]",
		":monocle_guy_with_gun:": "(c ͡|Q ͜ʖ ͡o)╦╤─",
		":epic_gun:": "︻┳デ═—",
		":lawnmower:": ".......... `.=. ,,,,,,,,,,,,,,",
		":srsly,_fu:": "(ಠ_ಠ)┌∩┐",
		":smug_bastard:": "(‾⌣‾)",
		":mattthehuman:": "óÔÔò ʕ·͡ᴥ·ʔ óÔÔò",
		":tie-fighter:": "|—O—|",
		":greatsword:": "{}oo((X))ΞΞΞΞΞΞΞΞΞΞΞΞΞ>",
		":susie_feagan:": "♪ღ♪*•.¸¸¸.•*¨¨*•.¸¸¸.•*•♪ღ♪¸.•*¨¨*•.¸¸¸.•*•♪ღ♪•* ♪ღ♪ ░H░A░P░P░Y░♪░B░I░R░T░H░D░A░Y░!░♪ღ♪ *•♪ღ♪*•.¸¸¸.•*¨¨*•.¸¸¸.•*•♪¸.•*¨¨*•.¸¸¸.•*•♪ღ♪•*",
		":macintosh:": "",
		":awesome_face:": "（のワの）",
		":donger:": "ヽ༼ຈل͜ຈ༽ﾉ",
		":kyubey:": "／人 ◕‿‿◕ 人＼",
		":honeycute:": "❤◦.¸¸. ◦✿",
		":breakys_rose:": "இڿڰۣ-ڰۣ—",
		":faydre:": "(U) [^_^] (U)",
		":huhu:": "█▬█ █▄█ █▬█ █▄█",
		":i_see_what_you_did_there:": "☚ (<‿<)☚",
		":spider:": "/X\('-')/X\",
		":assault_rifle:": "╾━╤デ╦︻",
		":domino:": "[: :|:::]",
		":dice:": "[: :]",
		":ak-47:": "︻┳デ═—",
		":dance:": "♪┏(°.°)┛┗(°.°)┓┗(°.°)┛┏(°.°)┓ ♪",
		":eaten_apple:": "[===]-'",
		":mtmtika:": ":o + :p = 69",
		":bee:": "¸.·´¯`·¸¸.·´¯`·.¸.-<\\^}0=:",
		":superman:": "-^mOm^-",
		":nice_ass:": "(_!_)",
		":gimme:": "༼ つ ◕_◕ ༽つ",
		":mustache:": ":{",
		":ukulele:": "{ o }==(::)",
		":sucky_sword:": "═╬════════►",
		":boobs:": "(* )( *)",
		":yay:": "\(ˆ˚ˆ)/",
		":sword_1_hand:": "(}====x(#)O================>",
		":double_table_flip:": "┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻",
		":fuckbear:": "╭∩╮ʕ•ᴥ•ʔ╭∩╮",
		":hybrix:": "ʕʘ̅͜ʘ̅ʔ",
		":rock2:": "\,,/(◣_◢)\,,/",
		":perky:": "( ๏ Y ๏ )",
		":hit:": "█▬█ █ ▀█▀",
		":pedo_bear:": "ʕ•ᴥ•ʔ",
		":people:": "ʕ•̫͡•ʕ*̫͡*ʕ•͓͡•ʔ-̫͡-ʕ•̫͡•ʔ*̫͡*ʔ-̫͡-ʔ",
		":hug2:": "<(°^°<0",
		":cheer:": "^(¤o¤)^",
		":dead_of_boredom:": "*¬*",
		":omg_what?:": "◕_◕",
		":japanese_sword:": "cxxxxx][===============>",
		":neko_face:": "o‿‿o",
		":jake:": "ˁ(OᴥO)ˀ",
		":hug:": "(っ◕‿◕)っ",
		":dumbbell:": "❚█══█❚",
		":snail:": "'-'_@_",
		":snail2:": "@╜",
		":homer_simpson:": "=( :c(|)",
		":canoe:": "~~~╘══╛~~~~~~~~~",
		":table_back:": "┏━┓ ︵ /(^.^/)",
		":arrow:": "»»---------------------►",
		":decko:": "/-.-\",
		":lennygun:": "( ͡° ͜ʖ ͡°)-︻デ┳═ー",
		":shotty:": "︻◦◤══一",
		":machine_gun:": "|'''''''|''''::::===O --- --- ---",
		":superdonger:": "─=≡Σ((( つ◕ل͜◕)つ",
		":rak:": "/⦿L⦿\",
		":smooth:": "(づ ￣ ³￣)づ ⓈⓂⓄⓄⓉⒽ",
		":meatwad:": "{٩ಠಠ}",
		":oh_hi.:": "┬┴┬┴┤･ω･)ﾉ├┬┴┬┴",
		":mango:": ") _ _ __/°°¬",
		":thug_life:": "( ͡ °~͡° )",
		":squid:": "くコ:彡",
		":stroll:": "ᕕ( ᐛ )ᕗ",
		":strong:": "❚█══█❚",
		":killyou:": "(⌐■_■)==ε/̵͇̿​̿/’̿’̿ ̿ ̿̿(╥﹏╥)",
		":panda:": "ヽ(￣(ｴ)￣)ﾉ",
		":laurel:": "{ O v O }",
		":nope:": "t(-_-t)",
		":kirby:": "(つ -‘ _ ‘- )つ",
		":power:": "ᕦ(ò_óˇ)ᕤ",
		":egg1:": "༼ つ ͡◕ Ѿ ͡◕ ༽つ",
		":egg2:": "ლ(́◕◞Ѿ◟◕‵ლ)",
		":cya:": "ヽ(´o｀；",
		":bunny:": "(\_/)",
		":sniperstars:": "✯╾━╤デ╦︻✯",
		":kokain:": "̿ ̿' ̿'\̵͇̿̿\з=(•̪●)=ε/̵͇̿̿/'̿''̿ ̿",
		":angry_lenny:": "( ͠° ͟ʖ ͡°)﻿",
		":3:": "ᕙ༼ ,,ԾܫԾ,, ༽ᕗ",
		":5:": "ᕙ༼ ,,இܫஇ,, ༽ᕗ",
		":noob:": " '_\" ",
		":metal:": "\m/_(>_<)_\m/",
		":nx:": "▄︻̷̿┻̿═━一",
		":killer:": "(⌐■_■)--︻╦╤─ - - - (╥﹏╥)",
		":ankush:": "︻デ┳═ー*----*",
		":fu:": "(ಠ_ಠ)┌∩┐",
		":russian:": "(°Д°)",
		":amused:": "(●*∩_∩*●)",
		":cry2:": "(¡~¡)",
		":kiss:": "(o'3'o)",
		":sorreh_bro:": "(◢_◣)",
		":owlkin:": "(ᾢȍˬȍ)ᾢ ļ ļ ļ ļ ļ",
		":formula1:": "\ō͡≡o˞̶",
		":yolo:": "Yᵒᵘ Oᶰˡʸ Lᶤᵛᵉ Oᶰᶜᵉ",
		":keep_an_eye_out:": "(ಠ_x) ༼☉",
		":rare:": "┌ಠ_ಠ)┌∩┐ ᶠᶸᶜᵏ♥ᵧₒᵤ",
		":rope:": "╚(▲_▲)╝",
		":chess:": "♚ ♛ ♜ ♝ ♞ ♟ ♔ ♕ ♖ ♗ ♘ ♙",
		":weather:": "☼ ☀ ☁ ☂ ☃ ☄ ☾ ☽ ❄ ☇ ☈ ⊙ ☉ ℃ ℉ ° ❅ ✺ ϟ",
		":upsidedown:": "( ͜。 ͡ʖ ͜。)",
		":old_lady_boobs:": "|\o/\o/|",
		":nathan:": "♪└(￣◇￣)┐♪└(￣◇￣)┐♪└(￣◇￣)┐♪",
		":cat_smile:": "≧◔◡◔≦﻿"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	var urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/;
	var imageUrlRegex = /^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}[-a-zA-Z0-9@:%_\+.~#?&\/=]*\/(([-a-zA-Z0-9@:%._\+~#,\(\)=\?]*)\.(?:jpe?g|gif|png))((\?|#)[-a-zA-Z0-9@:%._\+~#,\(\)=\?]+)?$/;

	var imagePath = /(?:\/)(([(\\s)-a-zA-Z0-9_.]*)\.(?:jpe?g|gif|png))/i;

	var containsUrl = function containsUrl(str) {
	  return urlRegex.test(str);
	};
	var extractUrl = function extractUrl(str) {
	  return str.match(urlRegex)[0];
	};

	var isImageUrl = function isImageUrl(str) {
	  return imageUrlRegex.test(str);
	};
	var extractImageUrl = function extractImageUrl(str) {
	  return str.match(imageUrlRegex)[0];
	};
	var extractImageFullName = function extractImageFullName(str) {
	  return str.match(imageUrlRegex)[1];
	};
	var extractImageName = function extractImageName(str) {
	  return str.match(imageUrlRegex)[2];
	};
	var extractImageExtension = function extractImageExtension(str) {
	  return str.match(imageUrlRegex)[3];
	};

	module.exports = {
	  containsUrl: containsUrl,
	  extractUrl: extractUrl,
	  isImageUrl: isImageUrl,
	  extractImageUrl: extractImageUrl,
	  extractImageFullName: extractImageFullName,
	  extractImageName: extractImageName,
	  extractImageExtension: extractImageExtension
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

	module.exports.noOp = function () {};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _require = __webpack_require__(5),
	    flatMap = _require.flatMap;

	var _require2 = __webpack_require__(16),
	    Spinner = _require2.Spinner;

	var inquirer = __webpack_require__(17);
	var Cursor = __webpack_require__(18);
	var chalk = __webpack_require__(19);
	var figlet = __webpack_require__(4);
	var clear = __webpack_require__(20);

	var _require3 = __webpack_require__(21),
	    wait = _require3.wait;

	/* ----------------------------------------- *
	        Private
	* ----------------------------------------- */


	var connectingSpinner = new Spinner('Connecting to chat');
	var cursor = new Cursor(1, 1);

	// log : String -> Promise
	var log = function log() {
	  var _console;

	  process.stdout.write("[K");
	  (_console = console).log.apply(_console, arguments);
	  return Promise.resolve();
	};

	/* ----------------------------------------- *
	        Public
	* ----------------------------------------- */

	// homeScreen : _ -> Promise
	var homeScreen = function homeScreen() {
	  clear();
	  return log(chalk.cyan.dim(figlet.textSync('H#cker Ch4t', { horizontalLayout: 'full' }))).then(function () {
	    return connectingSpinner.start();
	  });
	};

	// connectionSuccess : _ -> Promise
	var connectionSuccess = function connectionSuccess() {
	  connectingSpinner.stop();
	  return log(chalk.cyan('
Client successfully connected!'));
	};

	// welcome : String -> Promise
	var welcome = function welcome(username) {
	  return log(chalk.magenta('

	Welcome H4ck3r ' + username));
	};

	// Command : { name : String, description : String }
	// help : [Command] -> Promise
	var help = function help(commands) {
	  var commandsInfo = flatMap(function (_ref) {
	    var name = _ref.name,
	        description = _ref.description;
	    return [chalk.cyan('	type'), chalk.white.bold(name), chalk.cyan(description + '

')];
	  }, commands);

	  return log.apply(undefined, [chalk.white.bold('

We g0t som3 c0ol comm4nds th4t you ne3d t0 kn0w:

')].concat(_toConsumableArray(commandsInfo), [chalk.white.bold('

Enj0y th1s r3sp0n5ibly... 

')])).then(function () {
	    return wait(200);
	  });
	};

	// message : { username : String, message : String } -> Promise
	var message = function message(_ref2) {
	  var username = _ref2.username,
	      _message = _ref2.message;
	  return log(chalk.green('?'), chalk.white.bold(username + ':'), chalk.cyan(_message));
	};

	// message : { username : String, message : String, voice : String } -> Promise
	var sayMessage = function sayMessage(_ref3) {
	  var username = _ref3.username,
	      message = _ref3.message,
	      voice = _ref3.voice;
	  return log(chalk.green('?'), chalk.white.bold(username + ':'), chalk.cyan((voice || '') + ' says "' + message + '"'));
	};

	// myMessage : { username : String, message : String } -> Promise
	var myMessage = function myMessage(msg) {
	  // remove the input line
	  cursor.move('up', 1);
	  process.stdout.write("[K");
	  return message(msg);
	};

	// mySayMessage : { username : String, message : String, voice : String } -> Promise
	var mySayMessage = function mySayMessage(msg) {
	  // remove the input line
	  cursor.move('up', 1);
	  process.stdout.write("[K");
	  return sayMessage(msg);
	};

	// activeUsers : [String] -> Promise
	var activeUsers = function activeUsers(_activeUsers) {
	  return log(chalk.magenta('
C0nnect3d H#ckerz :
'), chalk.cyan(_activeUsers.reduce(function (acc, username) {
	    return acc + '	- ' + username + '
';
	  }, '')));
	};

	// availableVoices :: [String] -> Promise
	var availableVoices = function availableVoices(voices) {
	  return log(chalk.magenta('
H3re 4re tH3 v01cez U c4n u5e :
'), chalk.cyan(voices.reduce(function (acc, voice) {
	    return acc + '	- ' + voice + '
';
	  }, '')));
	};

	// availableVoices :: [String] -> Promise
	var availableEmojis = function availableEmojis(emojis) {
	  return log(chalk.magenta('
H3re 4re tH3 3m0jis U c4n u5e :
'), chalk.cyan(Object.keys(emojis).reduce(function (acc, emoji) {
	    return acc + '	- ' + emoji + '
';
	  }, '')), chalk.magenta('
Th1s is a f#kin lo7 0f em0j1s.
'));
	};

	// userJoined : String -> Promise
	var userJoined = function userJoined(username) {
	  return log(chalk.green(username + ' has joined the chat.'));
	};

	// userLeft : String -> Promise
	var userLeft = function userLeft(username) {
	  return log(chalk.red(username + ' has left the chat.'));
	};

	// mutedStatus : Boolean -> Promise
	var mutedStatus = function mutedStatus(isMuted) {
	  return log(chalk.cyan('m3553n93r2 is now ' + (isMuted ? 'muted' : 'unmuted') + '.'));
	};

	// leetSpeakStatus : Boolean -> Promise
	var leetSpeakStatus = function leetSpeakStatus(isLeetSpeak) {
	  return log(chalk.cyan('m3553n93r2 is now in ' + (isLeetSpeak ? '1337' : 'normal') + ' mode.'));
	};

	// loginPrompt : _ -> Promise
	var loginPrompt = function loginPrompt() {
	  return inquirer.prompt([{
	    name: 'username',
	    type: 'input',
	    message: 'Enter your username:',
	    validate: function validate(value) {
	      if (value.length > 10) {
	        return 'W4y to0 long...';
	      } else if (!value.trim()) {
	        return 'Pl34ze tYp3 y0ur Uz3rN4me';
	      } else {
	        return true;
	      }
	    }
	  }]).then(function (_ref4) {
	    var username = _ref4.username;
	    return username.trim();
	  });
	};

	// messagePrompt : String -> Promise
	var messagePrompt = function messagePrompt(username) {
	  return inquirer.prompt([{
	    name: 'message',
	    type: 'input',
	    message: username + ':',
	    validate: function validate(value) {
	      if (value.length > 255) {
	        return 'W4y to0 long...';
	      } else if (!value.trim()) {
	        return 'Th1s 1s 4 Mess3ngeR 4pp. TyP3 a F#ck1n\' M3ss4ge.';
	      } else {
	        return true;
	      }
	    }
	  }]).then(function (_ref5) {
	    var message = _ref5.message;
	    return message.trim();
	  });
	};

	module.exports = {
	  homeScreen: homeScreen,
	  connectionSuccess: connectionSuccess,
	  welcome: welcome,
	  help: help,
	  message: message,
	  myMessage: myMessage,
	  sayMessage: sayMessage,
	  mySayMessage: mySayMessage,
	  activeUsers: activeUsers,
	  availableVoices: availableVoices,
	  availableEmojis: availableEmojis,
	  userJoined: userJoined,
	  userLeft: userLeft,
	  mutedStatus: mutedStatus,
	  leetSpeakStatus: leetSpeakStatus,
	  loginPrompt: loginPrompt,
	  messagePrompt: messagePrompt
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("clui");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("inquirer");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("terminal-cursor");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("clear");

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	var wait = function wait(milliseconds) {
	  return new Promise(function (resolve) {
	    return setTimeout(resolve, milliseconds);
	  });
	};

	module.exports = {
	  wait: wait
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var notifier = __webpack_require__(23);
	var path = __webpack_require__(9);
	var open = __webpack_require__(24);

	var _require = __webpack_require__(13),
	    containsUrl = _require.containsUrl,
	    extractUrl = _require.extractUrl;

	notifier.on('click', function (notifierObject, _ref) {
	  var message = _ref.message;

	  if (containsUrl(message)) open(extractUrl(message));
	});

	var notify = function notify(options) {
	  return new Promise(function (resolve, reject) {
	    notifier.notify(options, function (err, response) {
	      if (err) return reject(err);else resolve(response);
	    });
	  }).catch(function (err) {
	    return console.error('notification error', err);
	  });
	};

	var notifyMessage = function notifyMessage(_ref2) {
	  var username = _ref2.username,
	      message = _ref2.message;
	  return notify({
	    title: username + ' s4y5 :',
	    message: message,
	    icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png')
	  });
	};

	var notifyLink = function notifyLink(_ref3) {
	  var username = _ref3.username,
	      message = _ref3.message;
	  return notify({
	    title: username + ' s3n7 a l1nk :',
	    message: 'Cl1ck here t0 0pen it.
' + extractUrl(message),
	    icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png'),
	    time: 30000,
	    wait: true
	  });
	};

	var messageReceived = function messageReceived(_ref4) {
	  var username = _ref4.username,
	      message = _ref4.message;

	  return containsUrl(message) ? notifyLink({ username: username, message: message }) : notifyMessage({ username: username, message: message });
	};

	var userJoined = function userJoined(username) {
	  return notify({
	    title: username + ' Joined the Ch4t',
	    message: 'c0me say h3ll0.',
	    icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png')
	  });
	};

	var userLeft = function userLeft(username) {
	  return notify({
	    title: username + ' Left the Ch4t',
	    message: 't0o b4d.',
	    icon: path.join(__dirname, 'assets', 'images', 'notif-thumbnail.png')
	  });
	};

	module.exports = {
	  messageReceived: messageReceived,
	  userJoined: userJoined,
	  userLeft: userLeft
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("node-notifier");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("open");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var Player = __webpack_require__(26);
	var Say = __webpack_require__(27);

	/* ----------------------------------------- *
	        Private
	* ----------------------------------------- */
	var player = new Player();
	var playFile = function playFile(fileName) {
	  return Promise.resolve(player.play(path.join(__dirname, 'assets', 'media', fileName)));
	};

	/* ----------------------------------------- *
	        Public
	* ----------------------------------------- */

	var notification = function notification() {
	  return playFile('decay.mp3');
	};

	var say = function say(message, voice) {
	  return new Promise(function (resolve, reject) {
	    Say.speak(message, voice, 1.0, function (err) {
	      if (err) return reject(err);
	      resolve();
	    });
	  }).catch(function (err) {
	    return console.log('Audio.say error :', err);
	  });
	};

	var voices = ['Agnes', 'Kathy', 'Princess', 'Vicki', 'Victoria', 'Albert', 'Alex', 'Bruce', 'Fred', 'Junior', 'Ralph', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos', 'Deranged', 'Good News', 'Hysterical', 'Pipe Organ', 'Trinoids', 'Whisper', 'Zarvox'];

	module.exports = {
	  notification: notification,
	  say: say,
	  voices: voices
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("play-sound");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("say");

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var State = function () {
	  function State() {
	    _classCallCheck(this, State);

	    this.state = {};
	  }

	  _createClass(State, [{
	    key: "setState",
	    value: function setState(stateAtom) {
	      var nextState = Object.assign({}, this.state, stateAtom);
	      this.stateWillUpdate(nextState);
	      this.state = nextState;
	    }
	  }, {
	    key: "stateWillUpdate",
	    value: function stateWillUpdate(nextState) {}
	  }]);

	  return State;
	}();

	module.exports = State;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
