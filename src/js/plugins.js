exports.uncompletePlugin = {
  install(tasks) {
    // ...
  },
  render(task) {
    if (!task.completed)
      return `<div class="task-uncompleted">
          ${task.overtime ? "<div>已超时</div>" : ""} 
          <div class="complete" onclick="completeTask(${task.id})"></div>
          <div class="delete" onclick="deleteTask(${task.id})"></div>
        </div>`;
    else return "";
  },
};

exports.completePlugin = {
  install(tasks) {
    // ...
  },
  render(task) {
    if (task.completed) return `<div class="task-completed"></div>`;
    else return "";
  },
};
