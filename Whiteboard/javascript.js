// test da vidimo da li se fajl uopste ucitao
console.log("javascript.js je ucitan");

// canvas i kontekst
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// stanje crtanja
let isDrawing = false;
let brushColor = "#000000";
let brushSize = 5;
let eraseMode = false;

// elementi iz toolbara
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushSize");
const drawModeBtn = document.getElementById("drawMode");
const eraseBtn = document.getElementById("erase");
const clearBtn = document.getElementById("clear");
const savePngBtn = document.getElementById("savePng");
const savePdfBtn = document.getElementById("savePdf");
const openMailPopupBtn = document.getElementById("openMailPopup");

// elementi za popup
const mailPopup = document.getElementById("mailPopup");
const mailAddressInput = document.getElementById("mailAddress");
const sendMailBtn = document.getElementById("sendMail");
const cancelMailBtn = document.getElementById("cancelMail");

// promjena boje
colorPicker.addEventListener("change", function () {
    brushColor = this.value;
    eraseMode = false;
});

// promjena velicine cetke
brushSizeInput.addEventListener("input", function () {
    brushSize = parseInt(this.value, 10);
});

// mod crtanja
drawModeBtn.addEventListener("click", function () {
    eraseMode = false;
});

// mod brisanja
eraseBtn.addEventListener("click", function () {
    eraseMode = true;
});

// pocetak crtanja
canvas.addEventListener("mousedown", function () {
    isDrawing = true;
});

// kraj crtanja
canvas.addEventListener("mouseup", function () {
    isDrawing = false;
    ctx.beginPath();
});

// mis izasao sa canvas
canvas.addEventListener("mouseleave", function () {
    isDrawing = false;
    ctx.beginPath();
});

// crtanje misem
canvas.addEventListener("mousemove", function (e) {
    if (!isDrawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.fillStyle = eraseMode ? "white" : brushColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
});

// ciscenje cijelog platna
clearBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// snimanje kao PNG
savePngBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

// snimi kao PDF
savePdfBtn.addEventListener("click", function () {
    window.print();
});

// otvori popup za mail
openMailPopupBtn.addEventListener("click", function () {
    mailPopup.style.display = "flex";
});

// zatvori popup bez slanja
cancelMailBtn.addEventListener("click", function () {
    mailPopup.style.display = "none";
    mailAddressInput.value = "";
});

// slanje mailto linka
sendMailBtn.addEventListener("click", function () {
    const email = mailAddressInput.value.trim();
    if (!email) {
        alert("Unesi email adresu");
        return;
    }

    const subject = encodeURIComponent("Whiteboard stranica");
    const body = encodeURIComponent(
        "Pozdrav,\n\nsaljem ti sadrzaj sa whiteboard stranice. Po potrebi sacuvaj PNG ili PDF pa ga prilozis u mail."
    );

    const mailtoLink = "mailto:" + email + "?subject=" + subject + "&body=" + body;
    window.location.href = mailtoLink;

    mailPopup.style.display = "none";
    mailAddressInput.value = "";
});
