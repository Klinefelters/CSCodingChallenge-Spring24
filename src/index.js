const { app, BrowserWindow } = require("electron");
const { initialSignIn, signedOut } = require("./signin/signin");
const createMenu = require("./menu");
const createSplash = require("./splash/splash");

let mainWindow;

function createWindow() {
	let visitedSignIn = false;
	let isInitialSignIn = true;
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

	createMenu(mainWindow);

	var splash = createSplash();
	mainWindow.menuBarVisible = false;
	mainWindow.loadURL("https://cad.onshape.com/");

	const handleNavigation = (event, url) => {
		if (url.includes("/signin")) {
			if (isInitialSignIn) {
				visitedSignIn = true;
				isInitialSignIn = false;
				initialSignIn(mainWindow);
				splash.close();
				mainWindow.show();
			} else {
				visitedSignIn = true;
				signedOut(mainWindow);
			}
		} else if (visitedSignIn) {
			mainWindow.webContents.executeJavaScript(`
                if (window.menu){
                    window.menu.innerHTML = '';
                }
            `);
			visitedSignIn = false;
		}
	};

	mainWindow.webContents.on("did-navigate", handleNavigation);
	mainWindow.webContents.on("did-navigate-in-page", handleNavigation);
}

app.whenReady().then(createWindow);
