const { app, BrowserWindow } = require("electron");
const { initialSignIn, signedOut } = require("./signin");
const { spawn } = require("child_process");

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		icon: __dirname + "/assets/onshape.png",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	var splash = new BrowserWindow({
		width: 500,
		height: 300,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	});

	splash.loadFile("src/splash/splash.html");
	splash.center();

	mainWindow.loadURL("https://cad.onshape.com/");

	mainWindow.webContents.once("did-finish-load", () => {
		initialSignIn(mainWindow);
		splash.close();
		mainWindow.show();
	});

	const handleNavigation = (event, url) => {
		console.log(url);
		if (url.includes("/signin")) {
			signedOut(mainWindow);
		} else {
			mainWindow.webContents.executeJavaScript(`
				if (window.menu){
					window.menu.innerHTML = '';
				}
			`);
		}
	};

	mainWindow.webContents.on("did-navigate", handleNavigation);
	mainWindow.webContents.on("did-navigate-in-page", handleNavigation);
}

app.whenReady().then(createWindow);
