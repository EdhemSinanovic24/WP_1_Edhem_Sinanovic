const questions = [
    {
        question: "Koji je glavni grad Bosne i Hercegovine?",
        answers: ["Sarajevo", "Tuzla", "Mostar", "Banja Luka"],
        correct: 0
    },
    {
        question: "Koliko kontinenata postoji?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Koji je najveći planet u Sunčevom sistemu?",
        answers: ["Mars", "Jupiter", "Saturn", "Neptun"],
        correct: 1
    },
    {
        question: "Koliko minuta ima jedan sat?",
        answers: ["30", "45", "60", "120"],
        correct: 2
    },
    {
        question: "Koja životinja je poznata kao kralj džungle?",
        answers: ["Tigar", "Lav", "Gepard", "Hijena"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    currentQuestion = 0;
    score = 0;

    document.getElementById("quiz-box").classList.remove("hidden");
    document.getElementById("result-box").classList.add("hidden");

    showQuestion();
}

function showQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("question").textContent = q.question;

    let answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    q.answers.forEach((ans, i) => {
        let btn = document.createElement("button");
        btn.classList.add("answer");
        btn.textContent = ans;

        btn.onclick = () => checkAnswer(i, btn);

        answersDiv.appendChild(btn);
    });

    updateProgress();
    document.getElementById("next-btn").classList.add("hidden");
}

function checkAnswer(index, btn) {
    let correctIndex = questions[currentQuestion].correct;
    let answerButtons = document.querySelectorAll(".answer");

    answerButtons.forEach(b => b.disabled = true);

    if (index === correctIndex) {
        btn.classList.add("correct");
        score++;
    } else {
        btn.classList.add("wrong");
        answerButtons[correctIndex].classList.add("correct");
    }

    document.getElementById("next-btn").classList.remove("hidden");
}

document.getElementById("next-btn").onclick = () => {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
};

function showResults() {
    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("result-box").classList.remove("hidden");

    document.getElementById("score-text").textContent =
        `Osvojili ste ${score} od ${questions.length} bodova!`;
}

function updateProgress() {
    let bar = document.getElementById("progress-bar");
    let percent = ((currentQuestion) / questions.length) * 100;
    bar.style.width = percent + "%";
}

startQuiz();
