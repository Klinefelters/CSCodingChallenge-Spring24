const { BrowserWindow } = require("electron");

function createSplash() {
	var splash = new BrowserWindow({
		width: 500,
		height: 300,
		frame: false,
		alwaysOnTop: true,
		icon: __dirname + "/assets/onshape.png",
	});

	splash.loadFile("src/splash/splash.html");
	splash.center();

	return splash;
}

module.exports = createSplash;
