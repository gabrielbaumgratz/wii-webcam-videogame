const { app, BrowserWindow } = require('electron');
const path = require('path');

// Inicializa o Servidor Local Invisível e o WebSocket
require('./server.js');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        title: "Wii Web Videogame",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Como o server.js está rodando, nós podemos carregar a URL localhost diretamente
    // Isso evita problemas de segurança de câmera (getUserMedia) e CORS no file://
    mainWindow.loadURL('http://localhost:8000');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    // Dá um tempinho minúsculo para o servidor Node levantar a porta 8000 antes de abrir a tela
    setTimeout(createWindow, 500);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
