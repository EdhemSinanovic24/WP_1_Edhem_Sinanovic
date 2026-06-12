// ======= KANBAN BOARD LOGIKA - STUDENT FUN ZONE =======

document.addEventListener("DOMContentLoaded", () => {
    loadBoard();
    updateCounts();

    // Event listeneri za glavnu alatnu traku
    document.getElementById("addTaskBtn").addEventListener("click", () => createNewTask());
    document.getElementById("savePngBtn").addEventListener("click", saveAsPng);
    document.getElementById("savePdfBtn").addEventListener("click", saveAsPdf);
    document.getElementById("clearBoardBtn").addEventListener("click", clearBoard);

    // Event listeneri za mail pop-up
    document.getElementById("sendEmailBtn").addEventListener("click", toggleEmailPopup);
    document.getElementById("popupCancelBtn").addEventListener("click", toggleEmailPopup);
    document.getElementById("popupSendBtn").addEventListener("click", sendEmailHandler);
});

// Drag and Drop globalne funkcije
window.allowDrop = function(ev) {
    ev.preventDefault();
}

window.drag = function(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

window.drop = function(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    
    // Provjera da li dropamo tačno u zonu za zadatke unutar kolone
    let targetZone = ev.target;
    if (!targetZone.classList.contains("column-tasks")) {
        targetZone = targetZone.closest(".column-tasks");
    }
    
    if (targetZone && draggedElement) {
        targetZone.appendChild(draggedElement);
        saveBoard();
        updateCounts();
    }
}

// Kreiranje novog zadatka
function createNewTask(text = "Klikni ovdje da izmijeniš tekst zadatka...", taskId = null) {
    const taskContainer = document.querySelector("#todo .column-tasks");
    
    const id = taskId || "task-" + Date.now();
    const card = document.createElement("div");
    card.className = "task-card";
    card.draggable = true;
    card.id = id;
    card.setAttribute("ondragstart", "drag(event)");

    // Sadržaj zadatka koji se može editovati direktno na klik
    card.innerHTML = `
        <p class="task-text" contenteditable="true">${text}</p>
        <div class="task-footer">
            <span class="task-date">📅 ${new Date().toLocaleDateString('bs')}</span>
            <button class="btn-delete-task" onclick="deleteTask('${id}')">❌ Ukloni</button>
        </div>
    `;

    // Automatsko spašavanje promjena teksta
    card.querySelector(".task-text").addEventListener("blur", () => {
        saveBoard();
    });

    taskContainer.appendChild(card);
    if (!taskId) saveBoard(); // Spasi samo ako je kreiran novi ručno
    updateCounts();
}

// Brisanje pojedinačnog zadatka
window.deleteTask = function(id) {
    const card = document.getElementById(id);
    if (card) {
        card.remove();
        saveBoard();
        updateCounts();
    }
}

// Ažuriranje brojača na vrhu kolona
function updateCounts() {
    document.querySelectorAll(".kanban-column").forEach(col => {
        const count = col.querySelector(".column-tasks").children.length;
        col.querySelector(".task-count").textContent = count;
    });
}

// 1. Lokalno spašavanje (localStorage)
function saveBoard() {
    const boardState = [];
    document.querySelectorAll(".kanban-column").forEach(col => {
        const colId = col.id;
        const tasks = [];
        col.querySelectorAll(".task-card").forEach(card => {
            tasks.push({
                id: card.id,
                text: card.querySelector(".task-text").innerText
            });
        });
        boardState.push({ columnId: colId, tasks: tasks });
    });
    localStorage.setItem("ipiKanbanState", JSON.stringify(boardState));
}

// Učitavanje table iz memorije pretraživača
function loadBoard() {
    const data = localStorage.getItem("ipiKanbanState");
    if (!data) return;
    
    const boardState = JSON.parse(data);
    boardState.forEach(colState => {
        const targetContainer = document.querySelector(`#${colState.columnId} .column-tasks`);
        if (targetContainer) {
            targetContainer.innerHTML = ""; // Očisti placeholder
            colState.tasks.forEach(t => {
                createNewTaskInColumn(t.text, t.id, targetContainer);
            });
        }
    });
}

function createNewTaskInColumn(text, id, container) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.draggable = true;
    card.id = id;
    card.setAttribute("ondragstart", "drag(event)");

    card.innerHTML = `
        <p class="task-text" contenteditable="true">${text}</p>
        <div class="task-footer">
            <span class="task-date">📅 ${new Date().toLocaleDateString('bs')}</span>
            <button class="btn-delete-task" onclick="deleteTask('${id}')">❌ Ukloni</button>
        </div>
    `;

    card.querySelector(".task-text").addEventListener("blur", () => saveBoard());
    container.appendChild(card);
}

// Očisti kompletnu ploču
function clearBoard() {
    if (confirm("Da li ste sigurni da želite obrisati sve zadatke sa ploče?")) {
        document.querySelectorAll(".column-tasks").forEach(zone => zone.innerHTML = "");
        localStorage.removeItem("ipiKanbanState");
        updateCounts();
    }
}

// 2. FUNKCIONALNOST: Snimi kao PNG
function saveAsPng() {
    const board = document.getElementById("kanbanBoard");
    html2canvas(board, { backgroundColor: "#0f172a" }).then(canvas => {
        const link = document.createElement("a");
        link.download = "kanban-izvjestaj.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

// 3. FUNKCIONALNOST: Snimi kao PDF (Zahtjev iz Projekta 1)
function saveAsPdf() {
    const board = document.getElementById("kanbanBoard");
    const opt = {
        margin:       10,
        filename:     'kanban-izvjestaj.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, backgroundColor: "#0f172a" },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(board).save();
}

// 4. FUNKCIONALNOST: Mail Pop-up prozor (Zahtjev iz Projekta 1)
function toggleEmailPopup() {
    const overlay = document.getElementById("emailOverlay");
    overlay.style.display = overlay.style.display === "flex" ? "none" : "flex";
}

function sendEmailHandler() {
    const emailInput = document.getElementById("targetEmail").value;
    if (!emailInput) {
        alert("Molimo unesite validnu e-mail adresu!");
        return;
    }

    // Izvlačenje podataka o zadacima za tekst maila
    let mailBody = "Moj trenutni Kanban Izvještaj:\n\n";
    document.querySelectorAll(".kanban-column").forEach(col => {
        const colTitle = col.querySelector("h3").innerText;
        mailBody += `--- ${colTitle} ---\n`;
        const tasks = col.querySelectorAll(".task-text");
        if(tasks.length === 0) mailBody += "(Nema zadataka)\n";
        tasks.forEach((t, index) => {
            mailBody += `${index + 1}. ${t.innerText}\n`;
        });
        mailBody += "\n";
    });

    // Otvaranje klijenta preko mailto metode sa skupljenim parametrima
    const subject = encodeURIComponent("IPI Kanban Ploča - Izvještaj zadataka");
    const body = encodeURIComponent(mailBody);
    
    window.location.href = `mailto:${emailInput}?subject=${subject}&body=${body}`;
    toggleEmailPopup(); // Zatvori pop-up nakon slanja
}