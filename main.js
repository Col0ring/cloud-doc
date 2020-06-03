const { app, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./src/config/menuTemplate')
const AppWindow = require('./src/AppWindow')
let mainWindow = null
let settingsWindow = null
app.on('ready', () => {
  const mainWindowConfig = {
    width: 1024,
    height: 680
  }
  const urlLocation = isDev ? 'http://localhost:3000' : '/'
  mainWindow = new AppWindow(mainWindowConfig, urlLocation)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parant: mainWindow
    }
    const settingsFileLocation = `file://${path.join(
      __dirname,
      './settings/settings.html'
    )}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
    settingsWindow.on('closed', () => {
      settingsWindow = null
    })
  })
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})
