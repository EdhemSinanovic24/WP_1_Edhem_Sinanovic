console.log("Kanban Board script loaded");

// Dugmad
const addTaskBtn = document.getElementById("addTaskBtn");
const saveBoardBtn = document.getElementById("saveBoardBtn");
const clearBoardBtn = document.getElementById("clearBoardBtn");

// Modal elementi
const taskModal = document.getElementById("taskModal");
const clearModal = document.getElementById("clearModal");

const taskInput = document.getElementById("taskInput");
const modalAddBtn = document.getElementById("modalAddBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");

const clearYesBtn = document.getElementById("clearYesBtn");
const clearNoBtn = document.getElementById("clearNoBtn");

// Kolone
const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");

const STORAGE_KEY = "kanbanBoardData";

// Otvaranje modala za novi zadatak
addTaskBtn.addEventListener("click", () => {
    taskInput.value = "";
    taskModal.style.display = "block";
    taskInput.focus();
});

// Zatvaranje modala za zadatak
modalCancelBtn.addEventListener("click", () => {
    taskModal.style.display = "none";
});

// Dodavanje zadatka
modalAddBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) {
        alert("Unesi tekst zadatka.");
        return;
    }
    createTask(text, todoList);
    taskModal.style.display = "none";
    saveToLocalStorage();
});

// Otvaranje modala za ciscenje
clearBoardBtn.addEventListener("click", () => {
    clearModal.style.display = "block";
});

// Ponisti ciscenje
clearNoBtn.addEventListener("click", () => {
    clearModal.style.display = "none";
});

// Potvrdi ciscenje
clearYesBtn.addEventListener("click", () => {
    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";
    localStorage.removeItem(STORAGE_KEY);
    clearModal.style.display = "none";
});

// Klik izvan modala zatvara modal
window.addEventListener("click", (e) => {
    if (e.target === taskModal) {
        taskModal.style.display = "none";
    }
    if (e.target === clearModal) {
        clearModal.style.display = "none";
    }
});

// Snimanje ploce kao PNG pomocu html2canvas
saveBoardBtn.addEventListener("click", () => {
    const board = document.querySelector(".board");
    html2canvas(board).then(canvas => {
        const link = document.createElement("a");
        link.download = "kanban-ploca.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

// Funkcija za kreiranje zadatka
function createTask(text, columnElement) {
    const task = document.createElement("div");
    task.className = "task";
    task.textContent = text;

    addDragAndDropEvents(task);
    columnElement.appendChild(task);
}

// Drag and drop logika
function addDragAndDropEvents(task) {
    task.draggable = true;

    task.addEventListener("dragstart", () => {
        task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
        saveToLocalStorage();
    });
}

// Dozvoli drop u taskList
document.querySelectorAll(".taskList").forEach(list => {
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".task.dragging");
        if (dragging && list) {
            list.appendChild(dragging);
        }
    });
});

// LocalStorage – snimanje stanja
function saveToLocalStorage() {
    const data = {
        todo: getTasksFromList(todoList),
        progress: getTasksFromList(progressList),
        done: getTasksFromList(doneList)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTasksFromList(listElement) {
    const tasks = [];
    listElement.querySelectorAll(".task").forEach(task => {
        tasks.push(task.textContent);
    });
    return tasks;
}

// LocalStorage – ucitavanje stanja
function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const data = JSON.parse(saved);

    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";

    data.todo.forEach(text => createTask(text, todoList));
    data.progress.forEach(text => createTask(text, progressList));
    data.done.forEach(text => createTask(text, doneList));
}

// Inicijalno ucitavanje
loadFromLocalStorage();
