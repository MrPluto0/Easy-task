module.exports = class TasksManager {
	#tasks;
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
			completed: false
		})
		new Notification("创建成功", { body: content });
	}
	getCompleteTaskHtml() {
		let innerHtml = "";
		this.#tasks.forEach((task) => {
			if (task.completed) {
				innerHtml += `
				<li class="task">
					<div class="task-content">
						<span class="task-ddl">${task.date.substr(11)}</span>&nbsp;
						<span class="task-text">${task.content}</span>
					</div>
					<div class="task-completed"></div>
				</li>`;
			}
		})
		return innerHtml;
	}
	getUnCompleteTaskHtml() {
		let innerHtml = "";
		this.#tasks.forEach((task) => {
			if (!task.completed) {
				// judge overtime
				let now = new Date();
				let ddl = new Date(task.date);
				task.overtime = ddl.getTime() < now.getTime();

				innerHtml += `
				<li class="task">
					<div class="task-content">
						<span class="task-ddl">${task.date.substr(11)}</span>&nbsp;
						<span class="task-text">${task.content}</span>
					</div>
					<div class="task-button">
						${task.overtime ? "<div>已超时</div>" : ""}
						<div class="complete" onclick="completeTodo(${task.id})"></div>
						<div class="delete" onclick="removeTodo(${task.id})"></div>
					</div>
				</li>`;
			}
		})
		return innerHtml;
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
	getTasks() {
		return this.#tasks;
	}
	removeCompleted() {
		this.#tasks = this.#tasks.filter((task) => !task.completed);
	}
}