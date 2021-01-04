const { app, Menu, shell, dialog, ipcMain } = require('electron')

const isMac = process.platform === 'darwin'

function getMenuTemplate(mainWindow) {
  return [
    ...(isMac ? [{
      role: 'appMenu'
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [{
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          // this is the main bit hijack the click event 
          click() {
            // construct the select file dialog 
            dialog.showOpenDialog({
                properties: ['openFile']
              })
              .then(function(fileObj) {
                // the fileObj has two props 
                if (!fileObj.canceled) {
                  mainWindow.webContents.send('FILE_OPEN', fileObj.filePaths)
                }
              })
              .catch(function(err) {
                console.error(err)
              })
          }
        },
        isMac ? {
          role: 'close'
        } : {
          role: 'quit'
        }
      ]
    },
    {
      role: 'editMenu'
    },
    {
      role: 'viewMenu'
    },
    {
      role: 'windowMenu'
    },
    {
      role: 'help',
      submenu: [{
        label: 'Developer Website',
        click: async () => {
          await shell.openExternal('https://software.onpointcoding.net/whatsappexportviewer')
        }
      }]
    }
  ];
}

module.exports = { getMenuTemplate }