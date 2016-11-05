const fs = require('fs')
const path = require('path')

const downloadsFolderPath =
  path.join(process.env.HOME, 'Downloads', 'ch4t')

const createDownloadFolderIfDoesntExist = () => {
  const exists = fs.existsSync(downloadsFolderPath)
  if (!exists) fs.mkdirSync(downloadsFolderPath)
}

module.exports = {
  downloadsFolderPath,
  createDownloadFolderIfDoesntExist,
}
