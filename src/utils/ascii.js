const imageToAscii = require("image-to-ascii")
const emojis = require('../assets/data/emojis.json')

const toAscii = str => new Promise((resolve, reject) => {
  imageToAscii(str, {
      colored: true,
      size: {
        height: 30,
      }
  }, (err, converted) => {
    if (err)
      reject(err)
    else
      resolve(converted)
  })
})
  .catch(err => {
    console.log('ascii convertion error :', err)
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
  toAscii,
  parseEmojis,
  asciiImage: {
    thumbUp,
    lollypop,
    rock,
    lourd,
  }
}
