const { app, BrowserWindow } = require("electron");
const { initialSignIn, signedOut } = require("./signin");
const createMenu = require("./menu");
const createSplash = require("./splash");

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

	createMenu(toggleSecondaryFullScreen);

	var splash = createSplash();

	mainWindow.setMenuBarVisibility(false);
	mainWindow.loadURL("https://cad.onshape.com/");

	mainWindow.webContents.once("did-finish-load", () => {
		initialSignIn(mainWindow);
		splash.close();
		mainWindow.show();
	});

	const handleNavigation = (event, url) => {
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

function toggleSecondaryFullScreen() {
	if (mainWindow.isFullScreen()) {
		mainWindow.setFullScreen(false);
	} else {
		mainWindow.setFullScreen(true);
		mainWindow.setMenuBarVisibility(false);
		mainWindow.setAutoHideMenuBar(true);
		mainWindow.maximize();
	}
}

app.whenReady().then(createWindow);
