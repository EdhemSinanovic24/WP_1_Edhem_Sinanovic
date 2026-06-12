// Prikupljanje svih DOM elemenata
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

// Početne postavke
let drawing = false;
let currentColor = colorPicker.value;
let isErasing = false;

// Funkcija za računanje tačnih koordinata miša/touch-a na platnu
function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// Funkcije crtanja
function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    const coords = getCoordinates(e);
    ctx.moveTo(coords.x, coords.y);
    draw(e); 
}

function endDraw() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    // ISPRAVLJENO: Ako NIJE pritisnut miš/touch, onda prekini (bilo je obrnuto u PDF-u)
    if (!drawing) return; 
    
    const coords = getCoordinates(e);

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Ako brišemo, koristimo čisto bijelu boju pozadine platna
    ctx.strokeStyle = isErasing ? "#FFFFFF" : currentColor;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
}

// --- Dogovori (Events) ---
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseleave", endDraw);

canvas.addEventListener("touchstart", (e) => {
    startDraw(e);
    e.preventDefault();
});
canvas.addEventListener("touchend", (e) => {
    endDraw();
    e.preventDefault();
});
canvas.addEventListener("touchmove", (e) => {
    draw(e);
    e.preventDefault();
});

// --- Toolbar Logika ---
colorPicker.addEventListener("input", () => {
    currentColor = colorPicker.value;
    isErasing = false;
    eraserBtn.textContent = "Briši";
    eraserBtn.classList.remove("active-eraser");
});

eraserBtn.addEventListener("click", () => {
    isErasing = !isErasing;
    eraserBtn.textContent = isErasing ? "Olovka" : "Briši";
    
    // Vizuelni indikator u CSS-u da je brisač aktivan
    if (isErasing) {
        eraserBtn.classList.add("active-eraser");
    } else {
        eraserBtn.classList.remove("active-eraser");
    }
});

clearBtn.addEventListener("click", () => {
    if (confirm("Da li želite obrisati cijelu ploču?")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

saveBtn.addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "moj_crtez.png";
    link.click();
});