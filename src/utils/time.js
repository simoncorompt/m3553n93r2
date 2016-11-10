const addZero = str => str.length < 2 ? `0${str}` : str

const formatTime = time => {
  const date = new Date(time)
  const hours = date.getHours().toString()
  const minutes = date.getMinutes().toString()
  return `${addZero(hours)}:${addZero(minutes)}`
}


module.exports = {
  formatTime
}
