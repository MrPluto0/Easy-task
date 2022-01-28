// render for index.html

// context isolation
const { ipcRenderer } = require("electron");

const Store = require("electron-store");
const TasksManager = require(__dirname + "/js/tasks.js");
const { uncompletePlugin, completePlugin } = require(__dirname +
  "/js/plugins.js");

const store = new Store();
let tasks = store.has("tasks") ? store.get("tasks") : [];

const tasksManager = new TasksManager(tasks);
tasksManager.registerPlugins(uncompletePlugin, completePlugin);

const closeDom = document.getElementById("close");
const pagesDom = document.getElementsByClassName("page");
const funcsDom = document.getElementsByClassName("func");

const addtodoDom = document.getElementById("func-add-todo");
const taskContentDom = document.getElementById("taskContent");
const taskDateDom = document.getElementById("taskDate");

const uncompletedDom = document.getElementById("uncompleted");
const completedDom = document.getElementById("completed");
const clearComDom = document.querySelector(".clearComplete");

let activePage = 0;

// switch pages
for (let i = 0; i < funcsDom.length; i++) {
  const el = funcsDom[i];
  el.addEventListener("click", () => {
    // update func-bar
    funcsDom[activePage].classList.remove("func-title_action");
    funcsDom[i].classList.add("func-title_action");

    // update page
    pagesDom[activePage].classList.remove("page_active");
    pagesDom[i].classList.add("page_active");

    activePage = i;
  });
}

// close the mainWindow
closeDom.addEventListener("click", () => {
  ipcRenderer.send("mainWindow:close");
});

// clearComplete
clearComDom.addEventListener("click", () => {
  tasksManager.removeTasks(true);
  render();
});

// add todo
addtodoDom.addEventListener("click", async () => {
  tasksManager.createTask(taskContentDom.value, taskDateDom.value);
  render();
});

// remind window event -> finish todo
ipcRenderer.on("finishTask", (event, task) => {
  completeTodo(task.id);
});

// finish todo
function completeTask(id) {
  tasksManager.setTask(id, true);
  render();
}

// remove todo
function deleteTask(id) {
  tasksManager.removeTask(id);
  render();
}

// render the index
function render() {
  let tasks = tasksManager.getTasks();

  tasks.forEach((task, i) => {
    ipcRenderer.send("setTaskTimer", task);
  });

  uncompletedDom.innerHTML = tasksManager.render(false);
  completedDom.innerHTML = tasksManager.render(true);

  store.set("tasks", tasks);
}

render();
