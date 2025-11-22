// ---------------- GENERISANJE BINGO TABLE ----------------

let gameOver = false;
let markedCount = 0;

function generateBoard() {
    const table = document.getElementById("bingoBoard");
    table.innerHTML = "";
    gameOver = false;
    markedCount = 0;

    hideWinLose();
    clearConfetti();

    let numbers = [];
    while (numbers.length < 25) {
        let num = Math.floor(Math.random() * 75) + 1;
        if (!numbers.includes(num)) numbers.push(num);
    }

    let index = 0;

    for (let i = 0; i < 5; i++) {
        let row = document.createElement("tr");

        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("td");
            cell.textContent = numbers[index];
            index++;

            cell.addEventListener("click", () => {
                if (gameOver) return;

                if (!cell.classList.contains("marked")) {
                    markedCount++;
                } else {
                    markedCount--;
                }

                cell.classList.toggle("marked");
                checkWin();
                checkLose();
            });

            row.appendChild(cell);
        }

        table.appendChild(row);
    }
}

// ---------------- PROVJERA POBJEDE ----------------

function checkWin() {
    const table = document.getElementById("bingoBoard");
    const rows = table.rows;

    // Rows
    for (let i = 0; i < 5; i++) {
        let win = true;
        for (let j = 0; j < 5; j++) {
            if (!rows[i].cells[j].classList.contains("marked")) win = false;
        }
        if (win) return showWin();
    }

    // Columns
    for (let j = 0; j < 5; j++) {
        let win = true;
        for (let i = 0; i < 5; i++) {
            if (!rows[i].cells[j].classList.contains("marked")) win = false;
        }
        if (win) return showWin();
    }

    // Diagonal 1
    let diag1 = true;
    for (let i = 0; i < 5; i++) {
        if (!rows[i].cells[i].classList.contains("marked")) diag1 = false;
    }
    if (diag1) return showWin();

    // Diagonal 2
    let diag2 = true;
    for (let i = 0; i < 5; i++) {
        if (!rows[i].cells[4 - i].classList.contains("marked")) diag2 = false;
    }
    if (diag2) return showWin();
}

// ---------------- PROVJERA PORAZA ----------------
// Ako ima 15 označenih, a nema bingo → poraz

function checkLose() {
    if (markedCount >= 15 && !gameOver) {
        showLose();
    }
}

// ---------------- WIN/LOSE ----------------

function showWin() {
    gameOver = true;
    document.getElementById("winMessage").style.display = "flex";
    launchConfetti();
}

function showLose() {
    gameOver = true;

    // Kreiramo lose poruku ako ne postoji
    let loseMsg = document.getElementById("loseMessage");
    if (!loseMsg) {
        loseMsg = document.createElement("div");
        loseMsg.id = "loseMessage";
        loseMsg.className = "win-message";
        loseMsg.style.background = "#ff4444";
        loseMsg.textContent = "😞 IZGUBIO/LA SI!";
        document.body.appendChild(loseMsg);
    }

    loseMsg.style.display = "flex";
}

function hideWinLose() {
    document.getElementById("winMessage").style.display = "none";

    let loseMsg = document.getElementById("loseMessage");
    if (loseMsg) loseMsg.style.display = "none";
}

// ---------------- CONFETTI ----------------

function launchConfetti() {
    for (let i = 0; i < 40; i++) {
        let conf = document.createElement("div");
        conf.classList.add("confetti-piece");
        conf.style.position = "fixed";
        conf.style.top = "-20px";
        conf.style.left = Math.random() * window.innerWidth + "px";
        conf.style.width = "8px";
        conf.style.height = "14px";
        conf.style.background = randomColor();
        conf.style.opacity = "0.9";
        conf.style.zIndex = "99999";
        conf.style.animation = "fall 1.8s linear forwards";

        document.body.appendChild(conf);

        setTimeout(() => conf.remove(), 2000);
    }
}

function clearConfetti() {
    document.querySelectorAll(".confetti-piece").forEach(e => e.remove());
}

function randomColor() {
    const colors = ["#00e1ff", "#00c4dd", "#ffffff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ---------------- EVENT ZA NOVU TABLU ----------------

document.getElementById("newBoardBtn").addEventListener("click", generateBoard);

// ---------------- PDF DOWNLOAD ----------------

document.getElementById("downloadPdfBtn").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;

    doc.setFontSize(18);
    doc.text("Bingo Kartica – Student Fun Zone", 20, yPos);
    yPos += 15;

    let table = document.getElementById("bingoBoard");
    doc.setFontSize(14);

    for (let i = 0; i < table.rows.length; i++) {
        let rowData = "";
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            rowData += table.rows[i].cells[j].textContent + "   ";
        }
        doc.text(rowData, 20, yPos);
        yPos += 10;
    }

    doc.save("bingo_kartica.pdf");
});

// ---------------- POPUP EMAIL ----------------

const popup = document.getElementById("emailPopup");
const cancelPopupBtn = document.getElementById("cancelPopupBtn");
const sendEmailPopupBtn = document.getElementById("confirmSendBtn");

document.getElementById("sendEmailBtn").addEventListener("click", () => {
    popup.style.display = "flex";
});

cancelPopupBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

// Slanje emaila kroz popup
sendEmailPopupBtn.addEventListener("click", () => {
    const email = document.getElementById("emailInput").value.trim();
    if (email === "") {
        alert("Unesite email adresu!");
        return;
    }

    let table = document.getElementById("bingoBoard");
    let text = "Moja Bingo kartica:%0D%0A%0D%0A";

    for (let i = 0; i < table.rows.length; i++) {
        let rowData = "";
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            rowData += table.rows[i].cells[j].textContent + " ";
        }
        text += rowData + "%0D%0A";
    }

    window.location.href = `mailto:${email}?subject=Bingo%20Kartica&body=${text}`;

    popup.style.display = "none";
});

// ---------------- START ----------------

generateBoard();
