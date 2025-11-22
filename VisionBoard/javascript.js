console.log("Vision Board loaded");

const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");

let colors = ["color1", "color2", "color3", "color4", "color5", "color6"];

// ADD NOTE
addNoteBtn.addEventListener("click", () => {
    createNote("Nova biljeska...");
});

// ADD QUOTE
addQuoteBtn.addEventListener("click", () => {
    createQuote("Novi citat...");
});

// ADD IMAGE
addImageBtn.addEventListener("click", () => {
    let random = Math.floor(Math.random() * 4) + 1;
    createImage(`slike/slika${random}.png`);
});

// CLEAR BOARD
clearBtn.addEventListener("click", () => {
    board.innerHTML = "";
    localStorage.removeItem("visionBoard");
});

// SAVE
saveBtn.addEventListener("click", () => {
    localStorage.setItem("visionBoard", board.innerHTML);
    alert("Ploča snimljena!");
});

// LOAD
loadBtn.addEventListener("click", () => {
    let saved = localStorage.getItem("visionBoard");
    if (saved) {
        board.innerHTML = saved;
        restoreEvents();
    }
});

// FUNCTIONS

function createNote(text) {
    let note = document.createElement("div");
    note.className = "note " + colors[Math.floor(Math.random() * colors.length)];
    note.contentEditable = "true";
    note.style.left = "100px";
    note.style.top = "100px";
    note.innerHTML = text;

    addDeleteButton(note);
    makeDraggable(note);

    board.appendChild(note);
}

function createQuote(text) {
    let quote = document.createElement("div");
    quote.className = "quote";
    quote.style.left = "150px";
    quote.style.top = "150px";
    quote.textContent = text;

    addDeleteButton(quote);
    makeDraggable(quote);

    board.appendChild(quote);
}

function createImage(src) {
    let container = document.createElement("div");
    container.className = "pinned-img";
    container.style.left = "200px";
    container.style.top = "200px";

    let img = document.createElement("img");
    img.src = src;
    container.appendChild(img);

    addDeleteButton(container);
    makeDraggable(container);

    board.appendChild(container);
}

function addDeleteButton(element) {
    let del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "x";
    del.onclick = () => element.remove();
    element.appendChild(del);
}

function makeDraggable(el) {
    let offsetX, offsetY, isDown = false;

    el.addEventListener("mousedown", e => {
        isDown = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mouseup", () => isDown = false);

    document.addEventListener("mousemove", e => {
        if (isDown) {
            el.style.left = (e.pageX - offsetX) + "px";
            el.style.top = (e.pageY - offsetY) + "px";
        }
    });
}

function restoreEvents() {
    document.querySelectorAll(".note, .quote, .pinned-img").forEach(el => {
        addDeleteButton(el);
        makeDraggable(el);
    });
}
