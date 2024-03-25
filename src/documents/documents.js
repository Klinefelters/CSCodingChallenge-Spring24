const fs = require("fs");
const path = require("path");

function documentAddOns(mainWindow) {
	const injectedCode = fs.readFileSync(
		path.join(__dirname, "magicbutton.js"),
		"utf8"
	);
	mainWindow.webContents.executeJavaScript(injectedCode);
}

module.exports = documentAddOns;
