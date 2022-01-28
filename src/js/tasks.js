module.exports = class TasksManager {
  #tasks = [];
  #plugins = [];
  constructor(tasks = []) {
    this.#tasks = tasks;
  }
  createTask(content, date) {
    if (content == "" || date == "") {
      new Notification("内容或日期为空");
      return;
    }
    this.#tasks.push({
      id: tasks.length,
      content: content,
      date: date,
      overtime: false,
      completed: false,
    });
    new Notification("创建成功", { body: content });
  }
  registerPlugins(...plugins) {
    for (let plugin of plugins) {
      plugin.install(this);
      this.#plugins.push(plugin);
    }
  }
  getTask(id) {
    return this.#tasks.find((t) => t.id == id);
  }
  setTask(id, completed) {
    let task = this.#tasks.find((t) => t.id == id);
    task.completed = completed;
  }
  removeTask(id) {
    this.#tasks = this.#tasks.filter((task) => task.id != id);
  }
  getTasks(completed) {
    if (completed === undefined) return this.#tasks;
    else return this.#tasks.filter((task) => task.completed === completed);
  }
  removeTasks(completed) {
    this.#tasks = this.#tasks.filter((task) => task.completed !== completed);
  }
  renderPlugins(task) {
    let appendHtml = "";
    for (let plugin of this.#plugins) {
      appendHtml += plugin.render(task);
    }
    return appendHtml;
  }
  render(completed) {
    let innerHtml = "";
    this.getTasks(completed).forEach((task) => {
      let now = new Date();
      let ddl = new Date(task.date);
      task.overtime = ddl.getTime() < now.getTime();

      innerHtml += `
				<li class="task">
					<div class="task-content">
						<span class="task-ddl">${task.date.substr(11)}</span>&nbsp;
						<span class="task-text">${task.content}</span>
					</div>
					${this.renderPlugins(task)}
				</li>`;
    });
    return innerHtml;
  }
};
