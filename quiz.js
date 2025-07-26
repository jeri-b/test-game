const countries = [
  { country: "Deutschland", capital: "Berlin", population: 83100000, area: 357022, gdp: 3845630000000 },
  { country: "Frankreich", capital: "Paris", population: 67390000, area: 551695, gdp: 2715518000000 },
  { country: "USA", capital: "Washington, D.C.", population: 331900000, area: 9833517, gdp: 21137500000000 },
  { country: "Kanada", capital: "Ottawa", population: 38250000, area: 9984670, gdp: 1990000000000 },
  { country: "Brasilien", capital: "Brasília", population: 212600000, area: 8515767, gdp: 1839758000000 },
  { country: "Japan", capital: "Tokio", population: 125800000, area: 377975, gdp: 5064873000000 },
  { country: "China", capital: "Peking", population: 1410000000, area: 9596961, gdp: 14722800000000 },
  { country: "Australien", capital: "Canberra", population: 25690000, area: 7692024, gdp: 1611130000000 },
  { country: "Italien", capital: "Rom", population: 59550000, area: 301340, gdp: 2001000000000 },
  { country: "Spanien", capital: "Madrid", population: 47350000, area: 505990, gdp: 1426860000000 },
  { country: "Südafrika", capital: "Pretoria", population: 59310000, area: 1219090, gdp: 282600000000 },
  { country: "Ägypten", capital: "Kairo", population: 104000000, area: 1002450, gdp: 404100000000 }
];

const randomNames = ["Lena", "Ben", "Mila", "Jonas", "Emma", "Luca", "Sophie", "Elias", "Lina", "Noah"];

let selectedMode = "capital";
let specialMode = "normal";
let totalQuestions = 10;
let showFacts = false;
let playerName = "";
let questions = [];
let currentIndex = 0;
let score = 0;
let lives = 3;
let timerInterval;
let startTime;
let elapsedTime = 0;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = `🕒 ${elapsedTime} Sekunden`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function initGame() {
  const modeSelect = document.getElementById("game-mode");
  const specialSelect = document.getElementById("special-mode");
  const nameInput = document.getElementById("player-name");
  const amountInput = document.getElementById("question-count");
  const factsCheckbox = document.getElementById("show-facts");

  selectedMode = modeSelect.value;
  specialMode = specialSelect.value;
  showFacts = factsCheckbox.checked;
  totalQuestions = parseInt(amountInput.value) || countries.length;

  playerName = nameInput.value.trim();
  if (!playerName) {
    playerName = randomNames[Math.floor(Math.random() * randomNames.length)];
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  document.getElementById("result-screen").style.display = "none";

  document.getElementById("mode-display").textContent = `Modus: ${selectedMode} | Spezial: ${specialMode}`;
  document.getElementById("timer").textContent = "🕒 0 Sekunden";

  score = 0;
  currentIndex = 0;
  lives = specialMode === "lifes" ? 3 : 1; // 3 Leben nur im Lebens-Modus
  questions = shuffle(countries).slice(0, totalQuestions);

  // Setup feedback & inputs
  document.getElementById("feedback").textContent = "";
  document.getElementById("next-button").style.display = "none";

  startTimer();
  showQuestion();
}

function showQuestion() {
  const q = questions[currentIndex];
  const prompt = document.getElementById("prompt");
  const input = document.getElementById("answerInput");
  const options = document.getElementById("answerOptions");
  const feedback = document.getElementById("feedback");
  const factBox = document.getElementById("fact-box");

  feedback.textContent = "";
  factBox.style.display = "none";
  factBox.textContent = "";
  input.value = "";
  input.style.display = "none";
  options.innerHTML = "";
  document.getElementById("next-button").style.display = "none";

  let questionText = "";
  let correctAnswer = "";

  if (selectedMode === "capital") {
    if (specialMode === "reverse") {
      // Rückwärts-Modus: Hauptstadt vorgeben, Land benennen
      questionText = `Welches Land hat die Hauptstadt ${q.capital}?`;
      correctAnswer = q.country;
    } else {
      questionText = `Was ist die Hauptstadt von ${q.country}?`;
      correctAnswer = q.capital;
    }
  } else if (selectedMode === "population") {
    questionText = `Welches Land hat mehr Einwohner: ${q.country} oder ...?`;
  } else if (selectedMode === "area") {
    questionText = `Welches Land ist flächenmäßig größer: ${q.country} oder ...?`;
  } else if (selectedMode === "gdp") {
    questionText = `Welches Land hat das höhere BIP: ${q.country} oder ...?`;
  }

  prompt.textContent = questionText;

  if (selectedMode === "capital" && (specialMode === "normal" || specialMode === "lifes" || specialMode === "suddendeath" || specialMode === "blitz" || specialMode === "reverse")) {
    if (specialMode === "reverse" || specialMode === "blitz" || specialMode === "suddendeath" || specialMode === "lifes" || specialMode === "normal") {
      if (specialMode === "reverse") {
        // bei reverse ist die Frage anders, Antwort ist Land
        input.style.display = "block";
        input.focus();
        input.onchange = () => checkAnswer(input.value);
      } else {
        // Multiple Choice mit 4 Optionen (Hauptstadt)
        const choices = shuffle([correctAnswer, ...shuffle(countries).filter(c => c.capital !== correctAnswer).slice(0, 3).map(c => c.capital)]);
        choices.forEach(c => {
          const btn = document.createElement("button");
          btn.textContent = c;
          btn.onclick = () => checkAnswer(c);
          options.appendChild(btn);
        });
      }
    }
  } else if (selectedMode === "capital" && specialMode === "type") {
    input.style.display = "block";
    input.focus();
    input.onchange = () => checkAnswer(input.value);
  } else {
    // Vergleichsmodus mit 2 Ländern
    const other = shuffle(countries.filter(c => c.country !== q.country))[0];
    let correctValue = q[selectedMode];
    let otherValue = other[selectedMode];
    let isCorrectCountry = correctValue >= otherValue ? q.country : other.country;

    const pair = shuffle([q.country, other.country]);
    pair.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c;
      btn.onclick = () => checkAnswer(c, isCorrectCountry, q, other);
      options.appendChild(btn);
    });
  }
}

function checkAnswer(answer, correctValue = null, q = null, other = null) {
  const feedback = document.getElementById("feedback");
  const factBox = document.getElementById("fact-box");
  let correctAnswer = "";

  if (selectedMode === "capital") {
    correctAnswer = questions[currentIndex].capital.toLowerCase();
    let cleanedAnswer = answer.trim().toLowerCase();

    if (specialMode === "reverse") {
      correctAnswer = questions[currentIndex].country.toLowerCase();
    }

    if (specialMode === "type" || specialMode === "reverse") {
      // Tippfehlertoleranz
      if (correctAnswer.includes(cleanedAnswer) || cleanedAnswer.includes(correctAnswer) || levenshteinDistance(cleanedAnswer, correctAnswer) <= 2) {
        feedback.textContent = "✅ Richtig!";
        score++;
      } else {
        feedback.textContent = `❌ Falsch! R
