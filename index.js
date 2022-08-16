const http = require('./src/app');
const { app, BrowserWindow, Menu, desktopCapturer, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

const { appConfig } = require('./src/config');
const port = appConfig.port || 8080;


http.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

let mainWindow;

app.whenReady().then(() => { 
    // The Main Window
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });
    
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`http://localhost:${port}/index.html`);

    ipcMain.on('message', (e, data) => {
        console.log(data)
        desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
            const decives = [];
            for (const source of sources) {
              decives.push({
                name: source.name,
                id: source.id
              })
            }
            mainWindow.webContents.send('set:sourse', decives)
        })
    });

})


// Menu Template
const templateMenu = []

templateMenu.push({
    label: 'DevTools',
    submenu: [
        {
            label: 'Show/Hide Dev Tools',
            accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }
    ]
})

const mainMenu = Menu.buildFromTemplate(templateMenu);
// Set The Menu to the Main Window
Menu.setApplicationMenu(mainMenu);