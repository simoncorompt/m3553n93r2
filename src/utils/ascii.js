const fs = require('fs')
const path = require('path')
const request = require('request')
const imageToAscii = require('asciify-image')
const { parseString: parseXMLString } = require('xml2js')

const emojis = require('../assets/data/emojis.json')
const { isImageUrl, extractImageFullName } = require('./url')

const get = url => new Promise((resolve, reject) => {
  request(url, (err, res, body) => {
    if (err) return reject(err)
    resolve(body)
  })
})

const parseXML = xml => new Promise((resolve, reject) => {
  parseXMLString(xml, function (err, result) {
    if (err) return reject(err)
    resolve(result)
  })
})

const downloadImage = url => new Promise((resolve, reject) => {
  if (!isImageUrl(url)) return reject(new Error('dowloadImage error : not a valid image url'))

  const imageName = extractImageFullName(url)
  const filePath = path.resolve('files', imageName)

  request.head(url, err => {
    if (err) return reject(err)
    request(url).pipe(fs.createWriteStream(filePath)).on('close', err => {
      if (err) return reject(err)
      resolve(filePath)
    })
  })
})

const urlToAscii = url =>
  downloadImage(url)
    .then(filePath => imageToAscii(filePath, { fit: 'box', height: 30 }))

const getRandomAsciiCat = () =>
  get('http://thecatapi.com/api/images/get?format=xml&type=jpg')
    .then(xml => parseXML(xml))
    .then(x => x.response.data[0].images[0].image[0].url[0].trim())
    .then(url => urlToAscii(url))

const parseEmojis = str => str.split(' ').map(x => emojis[x] || x).join(' ')

const thumbUp = `

          /(|
         (  :
        __\\  \\  _____
      (____)  \`|
     (____)|   |
      (____).__|
       (___)__.|_____

`

const lollypop = `

      ,-""-.
     :======:
     :======;
      \`-.,-'
        ||
      _,''--.    _____
     (/ __   \`._|
    ((_/_)\\     |
     (____)\`.___|
      (___)____.|_____

`

const rock = `

                              __
                             /  \\
                            |    |
              _             |    |
           /'  |            | _  |
           |   |            |    |
           | _ |            |    |
           |   |            |    |
           |   |        __  | _  |
           | _ |  __   /  \\ |    |
           |   | /  \\ |    ||    |
           |   ||    ||    ||    |       _---.
           |   ||    ||    |. __ |     ./     |
           | _. | -- || -- |    \`|    \/      \/\/
           |'   |    ||    |     |   /\`     (/
           |    |    ||    |     | ./       /
           |    |.--.||.--.|  __ |/       .|
           |  __|    ||    |-'            /
           |-'   \\__/  \\__/             .|
           |       _.-'                 /
           |   _.-'      /             |
           |            /             /
           |           |             /
           \`           |            /
           \\          |          /'
           |          \`        /
           \\                .'
           |                |
           |                |
           |                |
           |                |

`

const lourd = `

                    .--.
                   /    \\
                   |    |
                   |    |
                   |  _ |
                   |    |
                   |    |
                   |    |
                   |  _ |
                   |    |
             .--.  |    |
            /    \\/     |
         .-<.     \\     |
        /    \\     \\    _\\_
        |     \\     \\.-')  \`.
      .-L.     \\     \\-'     \\
     /    \\     \\  .')    ,-  \\
     |     \\     \\\`-' \`--\\     \\
     | (    \\  .')   /    \`.   |
     | _\\    \\\`-'   /          |
     \\   \\  .')               /
      \\   \`--'     /         /
       \\           |        /
        \\                 .'
         \\          _ .  /
          \\ _ . - '      |
          |              |
          |              |

`


module.exports = {
  urlToAscii,
  getRandomAsciiCat,
  parseEmojis,
  asciiImage: {
    thumbUp,
    lollypop,
    rock,
    lourd,
  }
}
