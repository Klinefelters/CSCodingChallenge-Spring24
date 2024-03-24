const Store = require("electron-store");
const store = new Store();
const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

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
	const injectedCode = fs.readFileSync(
		path.join(__dirname, "checkbox.js"),
		"utf8"
	);
	mainWindow.webContents.executeJavaScript(injectedCode);
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
	const injectedCode = fs.readFileSync(
		path.join(__dirname, "credentials.js"),
		"utf8"
	);
	mainWindow.webContents.executeJavaScript(injectedCode);
}
module.exports = {
	initialSignIn,
	signedOut,
};
