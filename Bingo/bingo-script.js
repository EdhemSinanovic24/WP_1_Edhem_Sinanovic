// Lista IT pojmova koji će se naći na Bingo ploči
const poolOfTerms = [
    "HTML", "CSS", "JavaScript", "SQL", "Git", 
    "Java", "Python", "PHP", "Bootstrap", "Linux",
    "API", "JSON", "Canvas", "Local Storage", "HTTP",
    "GitHub", "Database", "Node.js", "DOM", "Array",
    "Variable", "Loop", "Function", "Button", "iframe"
];

// Pitanja i tačni odgovori povezani sa pojmovima
const quizQuestions = [
    { q: "Koja platforma za hostovanje koda koristi Git i omogućava timsku saradnju na projektima putem repozitorija?", a: "GitHub" },
    { q: "Koja server-side JavaScript platforma omogućava pokretanje JavaScript koda izvan pretraživača?", a: "Node.js" },
    { q: "Koji popularan CSS framework pruža gotove klase za brzi responzivni dizajn web stranica?", a: "Bootstrap" },
    { q: "Koji programski konstrukt koristimo kada želimo ponavljati isti blok koda određeni broj puta?", a: "Loop" },
    { q: "Kako nazivamo višekratno upotrebljiv blok koda koji prima parametre i vraća rezultat?", a: "Function" }
];

let boardState = Array(25).fill(false); // Prati koja su polja pogođena
let cellTerms = []; // Čuva pojmove raspoređene na ploči
let currentQuestionIndex = 0;
let score = 0;
let activeQuestions = [];

const bingoBoard = document.getElementById("bingoBoard");
const currentQuestionText = document.getElementById("currentQuestion");
const startBtn = document.getElementById("startBtn");
const scoreValue = document.getElementById("scoreValue");
const remainingValue = document.getElementById("remainingValue");
const winOverlay = document.getElementById("winOverlay");
const restartBtn = document.getElementById("restartBtn");

// Pokretanje igre
startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", () => {
    winOverlay.style.display = "none";
    initGame();
});

function initGame() {
    startBtn.style.display = "none";
    score = 0;
    scoreValue.innerText = score;
    boardState = Array(25).fill(false);
    
    // Centralno polje (indeks 12) je uvijek "FREE SPACE" (automatski pogodak)
    boardState[12] = true; 

    // Promiješaj pojmove i uzmi prvih 25 za ploču
    cellTerms = [...poolOfTerms].sort(() => Math.random() - 0.5);
    cellTerms[12] = "FREE SPACE"; // Sredina je slobodna

    // Promiješaj pitanja za ovu partiju
    activeQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;

    renderBoard();
    nextQuestion();
}

// Generisanje ploče u HTML-u
function renderBoard() {
    bingoBoard.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement("div");
        cell.className = "bingo-cell";
        cell.innerText = cellTerms[i];
        cell.dataset.index = i;

        if (i === 12) {
            cell.classList.add("free-space", "matched");
        }

        cell.addEventListener("click", handleCellClick);
        bingoBoard.appendChild(cell);
    }
}

// Postavljanje sljedećeg pitanja
function nextQuestion() {
    remainingValue.innerText = activeQuestions.length - currentQuestionIndex;

    if (currentQuestionIndex < activeQuestions.length) {
        currentQuestionText.innerText = activeQuestions[currentQuestionIndex].q;
    } else {
        currentQuestionText.innerText = "Nestalo je pitanja! Kliknite 'Igraj ponovo' za novu partiju.";
    }
}

// Klik na polje ploče
function handleCellClick(e) {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.dataset.index);

    // Ako je polje već pogođeno ili igra nije počela, ignoriši
    if (boardState[index] || activeQuestions.length === 0 || currentQuestionIndex >= activeQuestions.length) return;

    const currentAnswer = activeQuestions[currentQuestionIndex].a;
    const clickedTerm = cellTerms[index];

    // Provjera da li je kliknuti pojam tačan odgovor na trenutno pitanje
    if (clickedTerm === currentAnswer) {
        boardState[index] = true;
        clickedCell.classList.add("matched");
        score++;
        scoreValue.innerText = score;

        currentQuestionIndex++;
        
        // Provjeri da li imamo pobjedu (Bingo)
        if (checkBingo()) {
            winOverlay.style.display = "flex";
            currentQuestionText.innerText = "🏆 Pobijedili ste! BRAVO!";
            return;
        }

        nextQuestion();
    } else {
        // Efekat pogrešnog klika (kratko crveno blinkanje)
        clickedCell.style.backgroundColor = "#ef4444";
        clickedCell.style.color = "white";
        setTimeout(() => {
            if (!boardState[index]) {
                clickedCell.style.backgroundColor = "#1e293b";
                clickedCell.style.color = "#cbd5e1";
            }
        }, 300);
    }
}

// Provjera spojenih linija (Bingo provjera)
function checkBingo() {
    // Kombinacije indexa koje donose pobjedu (5 vodoravno, 5 uspravno, 2 dijagonale)
    const winningLines = [
        // Vodoravno
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        // Uspravno
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        // Dijagonale
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    return winningLines.some(line => line.every(index => boardState[index]));
}