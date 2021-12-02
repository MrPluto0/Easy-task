const { app, BrowserWindow, Tray, Menu, MenuItem, ipcMain } = require('electron');
const path = require("path");
const Store = require("electron-store");
const store = new Store();

const iconPath = path.resolve(__dirname, './src/img/icon.png');
const preLoadPath = path.resolve(__dirname, "./preload.js");
const remindPath = path.resolve(__dirname, "./src/remind.html");
const indexPath = path.resolve(__dirname, "./src/index.html");

let mainWindow, tray;
let remindWindows = [], timers = [];

app.on("ready", () => {
	// create main windown
	createMainWindow();

	// new tray
	tray = new Tray(iconPath);

	tray.setToolTip('Tasky');
	tray.on("click", () => {
		if (mainWindow.isVisible()) {
			mainWindow.hide();
		} else {
			mainWindow.show();
		}
	})
	tray.on("right-click", () => {
		const menuConfig = Menu.buildFromTemplate([
			{
				label: "Quit",
				click: () => app.quit()
			}
		])
		tray.popUpContextMenu(menuConfig);
	})
})

// IPC
ipcMain.on("mainWindow:close", () => {
	mainWindow.hide();
})

ipcMain.on("remindWindow:close", (event, id) => {
	let remindWindow = remindWindows.find((win) => win.webContents.id == id);
	remindWindow && remindWindow.close();
})

ipcMain.on("setTaskTimer", (event, task) => {
	if (!task.completed && !task.overtime) {
		let now = new Date();
		let ddl = new Date(task.date);
		console.log("New Task: ", ddl.getTime() - now.getTime());
		setTimeout(() => {
			createRemindWindow(task);
		}, ddl.getTime() - now.getTime());
	}
})

// ---- Store ----
// ipcMain.on('electron-store-get', async (event, val) => {
// 	if (store.get(val))
// 		event.returnValue = store.get(val);
// 	else
// 		event.returnValue = [];
// });

// ipcMain.on('electron-store-set', async (event, property, val) => {
// 	// console.log(val);
// 	store.set(property, val);
// });

function createMainWindow() {
	// create a window
	mainWindow = new BrowserWindow({
		frame: false, 					// no border
		// resizable: false,				// no resize
		width: 800,
		height: 600,
		icon: iconPath,
		webPreferences: {
			backgroundThrottling: false, // run in back
			nodeIntegration: true,		 // use nodeApi
			contextIsolation: false,		 // make preload success
			// preload: preLoadPath
		}
	});

	// load the html
	mainWindow.loadFile(indexPath);
	// mainWindow.removeMenu();
}

function createRemindWindow(task) {
	let remindWindow = new BrowserWindow({
		height: 200,
		width: 300,
		resizable: false,
		frame: false,
		icon: iconPath,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			// preload: path.join(__dirname, './preload.js')
		}
	});
	remindWindows.push(remindWindow);

	if (!remindWindow.isVisible()) {
		remindWindow.show();
	}

	remindWindow.removeMenu();
	remindWindow.setAlwaysOnTop(true)
	remindWindow.loadFile(remindPath);

	// 此时渲染进程未创建监听事件，因此未触发
	// console.log(new Date().getTime());
	// remindWindow.webContents.send("setTask", remindWindow.webContents.id, task);

	remindWindow.webContents.on("did-finish-load", () => {
		remindWindow.webContents.send("setTask", remindWindow.webContents.id, task);
	})

	remindWindow.on("closed", () => {
		remindWindows = remindWindows.filter((win) => win != remindWindow);
		remindWindow = null;
	})

	setTimeout(() => {
		remindWindow && remindWindow.close();
	}, 30 * 1000);
}
