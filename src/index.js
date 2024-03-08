const { app, BrowserWindow } = require('electron');
const selectCredentials = require('./credentials/selectCredentials');
const path = require('path');

let mainWindow;

async function handleSignIn () {
  const { email, password } = await selectCredentials(mainWindow);
  mainWindow.webContents.executeJavaScript(`
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');

    emailInput.value = "${email}";
    passwordInput.value = "${password}";

    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    document.querySelector('button[type="submit"]').click();
  `);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the OnShape URL
  mainWindow.loadURL('https://cad.onshape.com/');

  mainWindow.webContents.once('did-finish-load', async() => {
    handleSignIn();
  });

  mainWindow.webContents.on('did-navigate', (event, url) => {
    mainWindow.webContents.once('did-finish-load', async() => {
      if (url.includes('/signin')) {
        handleSignIn();
      }
    });
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);