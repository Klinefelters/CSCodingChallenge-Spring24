const Store = require("electron-store");
const store = new Store();
const { ipcMain } = require("electron");

ipcMain.on("save-credentials", (event, { email, password }) => {
	const credentials = { email, password };
	const existingCredentials = store.get("credentials", []);
	existingCredentials.unshift(credentials);
	store.set("credentials", existingCredentials);
});

ipcMain.on("delete-credential", (event, { index }) => {
	const credentials = store.get("credentials", []);
	credentials.splice(index, 1);
	store.set("credentials", credentials);
});

ipcMain.handle("get-credentials", () => {
	return store.get("credentials", []);
});

function gatherCredentials(mainWindow) {
	mainWindow.webContents.executeJavaScript(`
        if (!document.querySelector('#saveCredentials')) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'saveCredentials';
            checkbox.value = 'true';
            checkbox.name = 'saveCredentials';
    
            const label = document.createElement('label');
            label.htmlFor = 'saveCredentials';
            label.appendChild(document.createTextNode('Save this account'));
    
            const form = document.querySelector('form');
            form.appendChild(checkbox);
            form.appendChild(label);
        }

        document.querySelector('button[type="submit"]').addEventListener('click', (event) => {

            const emailInput = document.querySelector('input[name="email"]');
            const passwordInput = document.querySelector('input[name="password"]');
            const email = emailInput.value;
            const password = passwordInput.value;
            const saveCredentials = document.querySelector('input[name="saveCredentials"]').checked;

            if (saveCredentials) {
                require('electron').ipcRenderer.send('save-credentials', { email, password });
            }
        });
    `);
}

function initialSignIn(mainWindow) {
	const credentials = store.get("credentials", []);
	if (credentials.length === 0) {
		gatherCredentials(mainWindow);
		return;
	}
	const { email, password } = credentials[0];
	mainWindow.webContents.executeJavaScript(`
        let emailInput = document.querySelector('input[name="email"]');
        let passwordInput = document.querySelector('input[name="password"]');

        emailInput.value = "${email}";
        passwordInput.value = "${password}";

        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

        document.querySelector('button[type="submit"]').click();
    `);
}

function signedOut(mainWindow) {
	gatherCredentials(mainWindow);
	mainWindow.webContents.executeJavaScript(`
        require('electron').ipcRenderer.invoke('get-credentials').then(credentials => {
            window.credentials = credentials;

            let menu = document.querySelector('#credentials-menu');
            if (!menu) {
                menu = document.createElement('div');
                menu.id = 'credentials-menu';
                menu.style.position = 'absolute';
                menu.style.right = '0';
                menu.style.top = '10%';
                document.body.appendChild(menu);
            } else {
                menu.innerHTML = '';
            }

            for (let i = 0; i < window.credentials.length; i++) {
                let credential = window.credentials[i];

                let buttonDiv = document.createElement('div');
                buttonDiv.style.display = 'flex';
                buttonDiv.style.justifyContent = 'space-between';

                let button = document.createElement('button');
                button.textContent = credential.email;
                button.addEventListener('click', () => {
                    let emailInput = document.querySelector('input[name="email"]');
                    let passwordInput = document.querySelector('input[name="password"]');
                    let submitButton = document.querySelector('button[type="submit"]');

                    emailInput.value = credential.email;
                    passwordInput.value = credential.password;
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

                    submitButton.click();
                });

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style.color = 'red';
                deleteButton.addEventListener('click', () => {
                    require('electron').ipcRenderer.send('delete-credential', {i});
                    button.remove();
                    deleteButton.remove();
                });

                buttonDiv.appendChild(button);
                buttonDiv.appendChild(deleteButton);
                menu.appendChild(buttonDiv);
            }
        });
    `);
}
module.exports = {
	initialSignIn,
	signedOut,
};
