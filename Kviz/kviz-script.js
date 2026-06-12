const quizData = [
    {
        question: "Koji CSS property koristimo da postavimo element u sredinu horizontalno koristeći Flexbox?",
        options: [
            "align-items: center",
            "justify-content: center",
            "text-align: center",
            "margin: center"
        ],
        correct: 1
    },
    {
        question: "Što je 'callback funkcija' u JavaScriptu?",
        options: [
            "Funkcija koja se poziva sama od sebe rekurzivno",
            "Funkcija koja vraća broj kao rezultat",
            "Funkcija koja se proslijeđuje kao argument drugoj funkciji",
            "Funkcija koja briše podatke iz memorije"
        ],
        correct: 2
    },
    {
        question: "Koji HTTP status kod označava da je resurs uspješno kreiran na serveru?",
        options: [
            "200 OK",
            "301 Moved Permanently",
            "404 Not Found",
            "201 Created"
        ],
        correct: 3
    },
    {
        question: "Koja je razlika između '==' i '===' u JavaScriptu?",
        options: [
            "Nema razlike, oba operatora rade identično",
            "'===' provjerava i tip i vrijednost, '==' samo vrijednost",
            "'==' provjerava i tip i vrijednost, '===' samo vrijednost",
            "'===' se koristi samo za stringove"
        ],
        correct: 1
    },
    {
        question: "Što označava pojam 'responsive design' u web razvoju?",
        options: [
            "Web stranica koja se brzo učitava",
            "Web stranica koja šalje email odgovore automatski",
            "Web stranica koja mijenja izgled ovisno o veličini ekrana uređaja",
            "Web stranica koja koristi animacije i tranzicije"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");
const questionNumberText = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const scorePercent = document.getElementById("scorePercent");
const resultText = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");

document.addEventListener("DOMContentLoaded", loadQuestion);

nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

restartBtn.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    resultBox.style.display = "none";
    quizBox.style.display = "block";
    loadQuestion();
});

function loadQuestion() {
    nextBtn.disabled = true;
    optionsContainer.innerHTML = "";

    questionNumberText.innerText = `Pitanje ${currentQuestion + 1} od ${quizData.length}`;
    questionText.innerText = quizData[currentQuestion].question;

    const progressPercent = (currentQuestion / quizData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    quizData[currentQuestion].options.forEach((option, index) => {
        const optionCard = document.createElement("div");
        optionCard.className = "option-card";
        optionCard.innerText = option;
        optionCard.addEventListener("click", () => selectOption(optionCard, index));
        optionsContainer.appendChild(optionCard);
    });
}

function selectOption(selectedCard, index) {
    const correctIndex = quizData[currentQuestion].correct;
    const allOptions = document.querySelectorAll(".option-card");

    if (index === correctIndex) {
        selectedCard.classList.add("correct");
        score++;
    } else {
        selectedCard.classList.add("incorrect");
        allOptions[correctIndex].classList.add("correct");
    }

    allOptions.forEach(card => card.classList.add("disabled"));
    nextBtn.disabled = false;
}

function showResults() {
    progressBar.style.width = "100%";
    quizBox.style.display = "none";
    resultBox.style.display = "block";

    const percentage = Math.round((score / quizData.length) * 100);
    scorePercent.innerText = `${percentage}%`;
    resultText.innerText = `Odgovorili ste tačno na ${score} od ukupno ${quizData.length} pitanja.`;
}
