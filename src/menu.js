const { Menu } = require("electron");

function createMenu(mainWindow) {
	function toggleFullScreen() {
		if (mainWindow.isFullScreen()) {
			mainWindow.setFullScreen(false);
		} else {
			mainWindow.setFullScreen(true);
			mainWindow.setAutoHideMenuBar(true);
			mainWindow.maximize();
		}
	}
	const menu = Menu.buildFromTemplate([
		{
			label: "View",
			submenu: [
				{
					label: "Full Screen",
					accelerator: "Alt+Enter",
					click: toggleFullScreen,
				},
			],
		},
	]);

	Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
