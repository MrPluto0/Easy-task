const { ipcRenderer } = require('electron');

const closeDom = document.getElementById("close")
const dateDom = document.querySelector(".date");
const remindDom = document.getElementById("remind");
const getDom = document.querySelector(".get");

ipcRenderer.on("setTask", (event, winId, task) => {
	
	dateDom.innerHTML = task.date.substr(11);
	remindDom.innerHTML = `该做${task.content}啦!`;

	closeDom.addEventListener("click", () => {
		ipcRenderer.send("remindWindow:close", winId);
	})

	getDom.addEventListener("click", () => {
		// 主渲染进程ID为1
		ipcRenderer.sendTo(1, "finishTask", task);
		ipcRenderer.send("remindWindow:close", winId);
	})
})
