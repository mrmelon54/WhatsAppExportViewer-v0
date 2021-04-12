const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { getMenuTemplate } = require('./menu');
const Alert = require("electron-alert");
const currentPackage = require('./package.json');

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

ipcMain.on('OPEN_ABOUT', (event, args) => {
  openAbout();
});

function openAbout() {
  let alert = new Alert();

  // I guess raw html here is OK
  // if the user wants to break the app then that's there problem
  let swalOptions = {
    title: "WhatsApp Export Viewer",
    html: `
Version: ${currentPackage.version}<br/>
ID: ${currentPackage.build.appId}<br/>
Copyright: ${currentPackage.build.copyright.replace('${author}',currentPackage.author.name)}<br/>
Electron: ${process.versions.electron}<br/>
Chrome: ${process.versions.chrome}<br/>
NodeJS: ${process.versions.node}<br/>
V8: ${process.versions.v8}
`,
    type: "info",
    background: "#121212",
    color: "#d2d2d2"
  };

  let promise = alert.fireFrameless(swalOptions, "About: WhatsApp Export Viewer", true, false);

  alert.browserWindow.on("blur", (event) => {
    alert.clickConfirm();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
