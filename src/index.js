const { app, BrowserWindow, Menu } = require("electron");
const { initialSignIn, signedOut } = require("./signin");

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
	const menu = Menu.buildFromTemplate([
		{
			label: "View",
			submenu: [
				{
					label: "Toggle Secondary Full Screen",
					accelerator: "Alt+Enter",
					click() {
						toggleSecondaryFullScreen();
					},
				},
			],
		},
	]);

	Menu.setApplicationMenu(menu);

	var splash = new BrowserWindow({
		width: 500,
		height: 300,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	});

	splash.loadFile("src/splash/splash.html");
	splash.center();
	mainWindow.setMenuBarVisibility(false);
	mainWindow.loadURL("https://cad.onshape.com/");

	mainWindow.webContents.once("did-finish-load", () => {
		initialSignIn(mainWindow);
		splash.close();
		mainWindow.show();
	});

	const handleNavigation = (event, url) => {
		// console.log(url);
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
		// Add any additional actions you want to perform when exiting full screen
	} else {
		mainWindow.setFullScreen(true);
		// Customize the full screen mode
		mainWindow.setMenuBarVisibility(false); // Hide the menu bar
		mainWindow.setAutoHideMenuBar(true); // Auto-hide menu bar
		mainWindow.maximize(); // Maximize the window to cover the whole screen
	}
}
app.whenReady().then(createWindow);
