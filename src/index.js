const { app, BrowserWindow } = require("electron");
const { initialSignIn, signedOut } = require("./signin");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadURL("https://cad.onshape.com/");

	mainWindow.webContents.once("did-finish-load", () =>
		initialSignIn(mainWindow)
	);

	const handleNavigation = (event, url) => {
		console.log(url);
		if (url.includes("/signin")) {
			signedOut(mainWindow);
		}
	};

	mainWindow.webContents.on("did-navigate", handleNavigation);
	mainWindow.webContents.on("did-navigate-in-page", handleNavigation);
}

app.whenReady().then(createWindow);
