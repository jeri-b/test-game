const countries = [
  { country: "Deutschland", capital: "Berlin", region: "europe" },
  { country: "Frankreich", capital: "Paris", region: "europe" },
  { country: "Japan", capital: "Tokio", region: "asia" },
  { country: "Brasilien", capital: "Brasília", region: "america" },
  { country: "Ägypten", capital: "Kairo", region: "africa" }
];

const randomNames = ["Lena", "Ben", "Mila", "Jonas", "Emma", "Noah"];

let playerName = "";
let currentQuestion = 0;
let score = 0;
let selectedCountries = [];
let mode = "multiple";
let timer = 0;
let timerInterval;

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", () => showQuestion(currentQuestion++));

function startGame() {
  const nameInput = document.getElementById("player-name").value.trim();
  const region = document.getElementById("region-select").value;
  mode = document.getElementById("quiz-mode").value;
  playerName = nameInput || randomNames[Math.floor(Math.random() * randomNames.length)];

  document.getElementById("player-display").textContent = `👤 ${playerName}`;

  selectedCountries = countries.filter(c =>
    region === "world" ? true : c.region === region
  );

  if (selectedCountries.length < 1) {
    alert("Keine Länder in dieser Region.");
    return;
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";

  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer-display").textContent = `🕒 ${timer}s`;
  }, 1000);

  showQuestion(currentQuestion++);
}

function showQuestion(index) {
  if (index >= selectedCountries.length) {
    return endGame();
  }

  nextBtn.style.display = "none";
  const q = selectedCountries[index];
  document.getElementById("question").textContent = `Was ist die Hauptstadt von ${q.country}?`;

  const answerArea = document.getElementById("answer-area");
  answerArea.innerHTML = "";

  if (mode === "multiple") {
    const choices = shuffle([
      q.capital,
      ...shuffle(countries.filter(c => c.country !== q.country)).slice(0, 3).map(c => c.capital)
    ]);
    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.onclick = () => checkAnswer(choice, q.capital);
      answerArea.appendChild(btn);
    });
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Hauptstadt eingeben";
    const btn = document.createElement("button");
    btn.textContent = "Antwort prüfen";
    btn.onclick = () => checkAnswer(input.value.trim(), q.capital);
    answerArea.appendChild(input);
    answerArea.appendChild(btn);
  }
}

function checkAnswer(given, correct) {
  const result = given.toLowerCase() === correct.toLowerCase();
  if (result) score++;
  document.getElementById("answer-area").innerHTML = result
    ? "✅ Richtig!"
    : `❌ Falsch! Richtig war: ${correct}`;
  nextBtn.style.display = "inline-block";
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("result-text").textContent = `${playerName}, du hast ${score} von ${selectedCountries.length} Punkten in ${timer} Sekunden erreicht.`;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
