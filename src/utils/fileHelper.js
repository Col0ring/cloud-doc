const fs = window.require('fs').promises
const errorCapture = async (cb, ...args) => {
  try {
    return (await (cb && cb(...args))) || true
  } catch (error) {
    console.log(error)
    return false
  }
}

const fileHelper = {
  readFile(path) {
    return errorCapture(fs.readFile, path, { encoding: 'utf-8' })
  },
  writeFile(path, content) {
    return errorCapture(fs.writeFile, path, content, { encoding: 'utf-8' })
  },
  renameFile(path, newPath) {
    return errorCapture(fs.rename, path, newPath)
  },
  deleteFile(path) {
    return errorCapture(fs.unlink, path)
  }
}

export default fileHelper
