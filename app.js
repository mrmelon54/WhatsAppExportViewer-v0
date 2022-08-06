const autoUpdater = require("electron-updater");

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const { getMenuTemplate } = require('./menu');
const AsarFs = require('asar-fs');
const fs = require('fs');
const path = require('path');
var currentPackage;

if(path.basename(__dirname)=="app.asar") {
  console.log("Package info hidden in app.asar");
  let d = path.dirname(__dirname);
  fs.readdirSync(d).forEach(file => {
    console.log(file);
  });
  console.log(path.join(d,'app.asar'));
  console.log(path.join(__dirname,'package.json'));
  currentPackage = JSON.parse(fs.readFileSync(path.join(d,'app.asar','package.json'), 'utf8'));
  console.log(currentPackage);
} else {
  currentPackage = JSON.parse(fs.readFileSync(path.join(__dirname,'package.json'), 'utf8'));
}

const funcs = {
  openAbout
};

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: 'icon.png'
  });

  const menu = Menu.buildFromTemplate(getMenuTemplate(win, funcs));
  Menu.setApplicationMenu(menu);

  win.loadFile(`${__dirname}/babel/index.html`);
}

function openAbout() {
  const options = {
    type: 'info',
    buttons: ['Ok'],
    defaultId: 2,
    title: currentPackage.productName,
    message: currentPackage.productName,
    detail: `
Version: ${currentPackage.version}
ID: ${currentPackage.appId}
Copyright: ${currentPackage.copyright}
Electron: ${process.versions.electron}
Chrome: ${process.versions.chrome}
NodeJS: ${process.versions.node}
V8: ${process.versions.v8}
`
  };

  dialog.showMessageBox(null, options, response => {
    console.log(response);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
