const { BrowserWindow, ipcMain } = require('electron');
const Store = require('electron-store');
const store = new Store();

function selectCredentials(mainWindow) {
    return new Promise((resolve) => {
        // Create a new window
        let win = new BrowserWindow({
            parent: mainWindow,
            modal: true,
            width: 400,
            height: 300,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        // Load the HTML file
        win.loadFile('src/credentials/selectCredentials.html');

        // When the window is ready, send the email and password pairs to the renderer process
        win.webContents.on('did-finish-load', () => {
            const credentials = store.get('credentials', []);
            win.webContents.send('credentials', credentials);
        });
        ipcMain.on('add-credential', (event, newCredential) => {
            // Get the current credentials
            const credentials = store.get('credentials', []);

            // Add the new credential
            credentials.push(newCredential);

            // Store the updated credentials
            store.set('credentials', credentials);
        });

        // When the selected credential is received, resolve the Promise
        ipcMain.once('select-credential', (event, credential) => {
            win.close();
            resolve(credential);
        });

        ipcMain.on('remove-credential', (event, index) => {
            let credentials = store.get('credentials', []);
            credentials.splice(index, 1);
            store.set('credentials', credentials);
            win.webContents.send('credentials', credentials);
        });
    });
}

module.exports = selectCredentials;