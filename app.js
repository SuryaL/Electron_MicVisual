const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
let win;

app.on('ready', () => {
    win = new BrowserWindow({
        width: 512,
        height: 512,
        frame: false,
        backgroundColor: '#000',
        icon: path.join(__dirname, 'icon.ico')
    })

    const myurl = url.format({
        protocol: 'file',
        slashes: true,
        pathname: path.join(__dirname, 'index.html')
    })

    win.loadURL(myurl);
	win.setResizable(false);
    // win.webContents.openDevTools();

    win.on('closed', () => {
        console.log('window closed')
        win = null;
        app.quit();
    })
})

// app.on('window-all-closed', function() {
//   if (process.platform != 'darwin')
//     app.quit();
// });
