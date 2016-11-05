const wait = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds))


module.exports = {
  wait
}
