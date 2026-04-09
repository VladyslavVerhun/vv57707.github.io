class Todo {
  constructor() {
    this.tasks = [
      { id: 1, text: "Kupić mleko", date: "2026-04-05", done: false },
      { id: 2, text: "Umyć naczynia", date: "2026-04-06", done: false },
      { id: 3, text: "Posprzątać pokój", date: "", done: false }
    ];

    this.taskList = document.getElementById("taskList");
    this.taskInput = document.getElementById("taskInput");
    this.dateInput = document.getElementById("dateInput");
    this.saveBtn = document.getElementById("saveBtn");
    this.searchInput = document.getElementById("searchInput");

    this.term = "";
    this.editingId = null;

    this.loadFromLocalStorage();
    this.draw();
    this.bindEvents();
  }

  bindEvents() {
    this.saveBtn.addEventListener("click", () => {
      if (this.editingId === null) {
        this.addTask();
      } else {
        this.updateTask();
      }
    });

    this.searchInput.addEventListener("input", () => {
      this.term = this.searchInput.value.trim().toLowerCase();
      this.draw();
    });
  }

  saveToLocalStorage() {
    localStorage.setItem("todoTasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem("todoTasks");

    if (data) {
      this.tasks = JSON.parse(data);
    } else {
      this.saveToLocalStorage();
    }
  }

  addTask() {
    const text = this.taskInput.value.trim();
    const date = this.dateInput.value;

    if (text.length < 3) {
      alert("Treść zadania musi mieć co najmniej 3 znaki.");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: text,
      date: date,
      done: false
    };

    this.tasks.push(newTask);
    this.saveToLocalStorage();

    this.taskInput.value = "";
    this.dateInput.value = "";

    this.draw();
  }

  startEdit(id) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) return;

    this.taskInput.value = task.text;
    this.dateInput.value = task.date;
    this.editingId = id;
  }

  updateTask() {
    const text = this.taskInput.value.trim();
    const date = this.dateInput.value;

    if (text.length < 3) {
      alert("Treść zadania musi mieć co najmniej 3 znaki.");
      return;
    }

    const task = this.tasks.find(task => task.id === this.editingId);
    if (!task) return;

    task.text = text;
    task.date = date;

    this.editingId = null;
    this.taskInput.value = "";
    this.dateInput.value = "";

    this.saveToLocalStorage();
    this.draw();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);

    if (this.editingId === id) {
      this.editingId = null;
      this.taskInput.value = "";
      this.dateInput.value = "";
    }

    this.saveToLocalStorage();
    this.draw();
  }

  toggleDone(id) {
    const task = this.tasks.find(task => task.id === id);
    if (!task) return;

    task.done = !task.done;
    this.saveToLocalStorage();
    this.draw();
  }

  getFilteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }

    return this.tasks.filter(task =>
      task.text.toLowerCase().includes(this.term)
    );
  }

  highlightText(text) {
    if (this.term.length < 2) {
      return text;
    }

    const escapedTerm = this.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "gi");

    return text.replace(regex, "<mark>$1</mark>");
  }

  draw() {
    this.taskList.innerHTML = "";

    const filteredTasks = this.getFilteredTasks();

    filteredTasks.forEach(task => {
      const item = document.createElement("div");
      item.className = "task-item";

      if (task.done) {
        item.classList.add("done");
      }

      item.innerHTML = `
                <input type="checkbox" ${task.done ? "checked" : ""}>
                <span class="task-text">${this.highlightText(task.text)}</span>
                <span class="task-date">${task.date}</span>
                <button class="delete-btn">🗑</button>
            `;

      const checkbox = item.querySelector('input[type="checkbox"]');
      const textEl = item.querySelector(".task-text");
      const dateEl = item.querySelector(".task-date");
      const deleteBtn = item.querySelector(".delete-btn");

      checkbox.addEventListener("change", () => {
        this.toggleDone(task.id);
      });

      textEl.addEventListener("click", () => {
        this.startEdit(task.id);
      });

      dateEl.addEventListener("click", () => {
        this.startEdit(task.id);
      });

      deleteBtn.addEventListener("click", () => {
        this.deleteTask(task.id);
      });

      this.taskList.appendChild(item);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.todo = new Todo();
});
