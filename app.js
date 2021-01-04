const { app, BrowserWindow, Menu } = require('electron')
const { getMenuTemplate } = require('./menu')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  const menu = Menu.buildFromTemplate(getMenuTemplate(win))
  Menu.setApplicationMenu(menu)

  win.loadFile(`${__dirname}/babel/index.html`)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
