const Player = require('play-sound')
const Say = require('say')

/* ----------------------------------------- *
        Private
* ----------------------------------------- */
const player = new Player()
const playFile = fileName => Promise.resolve(
  player.play(path.join(__dirname, 'assets', 'media', fileName))
)


/* ----------------------------------------- *
        Public
* ----------------------------------------- */

const notification = () => playFile('decay.mp3')

const say = (message, voice) => new Promise((resolve, reject) => {
  Say.speak(message, voice, 1.0, err => {
    if (err) return reject(err)
    resolve()
  })
})
  .catch(err => console.log('Audio.say error :', err))


const voices = [
  'Agnes',
  'Kathy',
  'Princess',
  'Vicki',
  'Victoria',
  'Albert',
  'Alex',
  'Bruce',
  'Fred',
  'Junior',
  'Ralph',
  'Bad News',
  'Bahh',
  'Bells',
  'Boing',
  'Bubbles',
  'Cellos',
  'Deranged',
  'Good News',
  'Hysterical',
  'Pipe Organ',
  'Trinoids',
  'Whisper',
  'Zarvox'
]

module.exports = {
  notification,
  say,
  voices,
}
