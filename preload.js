const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	store: {
		get(val) {
			ipcRenderer.send('electron-store-get', val);
		},
		set(property, val) {
			ipcRenderer.send('electron-store-set', property, val);
		},
		// Other method you want to add like has(), reset(), etc.
	},
});