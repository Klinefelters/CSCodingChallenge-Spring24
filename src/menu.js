const { Menu } = require("electron");

function createMenu(toggleFullScreen) {
    const menu = Menu.buildFromTemplate([
        {
            label: "View",
            submenu: [
                {
                    label: "Toggle Secondary Full Screen",
                    accelerator: "Alt+Enter",
                    click: toggleFullScreen,
                },
            ],
        },
    ]);

    Menu.setApplicationMenu(menu);
}

module.exports = createMenu;