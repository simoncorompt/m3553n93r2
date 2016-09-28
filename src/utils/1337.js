const convertTo1337 = str =>
  str.split('').map(to1337).join('')

const leetMap = {
  'a': '4',
  'e': '3',
  'g': '9',
  't': '7',
  'i': '1',
  'o': '0',
}

const to1337 = char =>
  leetMap[char.toLowerCase()] || char

module.exports = {
  convertTo1337
}
