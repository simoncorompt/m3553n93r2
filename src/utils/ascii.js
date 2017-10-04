const fs = require('fs')
const path = require('path')
const request = require('request')
const emojis = require('../assets/data/emojis.json')
const { isImageUrl, extractImageFullName } = require('./url')
const { downloadsFolderPath, createDownloadFolderIfDoesntExist } = require('./files')

const fileExists = filePath => new Promise((resolve, reject) => {
  var parsed = filePath.replace(/\\/g, '')
  if (fs.existsSync(parsed)) return resolve(parsed)
  return reject(filePath)
})

const downloadImage = url => new Promise((resolve, reject) => {
  if (!isImageUrl(url)) return reject(new Error('dowloadImage error : not a valid image url'))

  createDownloadFolderIfDoesntExist()

  const imageName = extractImageFullName(url)
  const filePath = path.join(downloadsFolderPath, imageName)

  request(url).pipe(fs.createWriteStream(filePath)).on('close', err => {
    if (err) return reject(err)
    resolve(filePath)
  })
})

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

const yeah = `

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

const up = `

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


const heart = `

            ******       ******
          **********   **********
        ************* *************
       *****************************
       *****************************
       *****************************
        ***************************
          ***********************
            *******************
              ***************
                ***********
                  *******
                    ***
                     *

`


module.exports = {
  parseEmojis,
  asciiImage: {
    thumbUp,
    lollypop,
    yeah,
    up,
    heart,
  }
}
