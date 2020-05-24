const { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/config/menuTemplate')
app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.webContents.openDevTools()
  const urlLocation = isDev ? 'http://localhost:3000' : '/'
  mainWindow.loadURL(urlLocation)
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})
