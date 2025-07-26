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
  const modeSelect = document.getElementById("mode");
  const specialSelect = document.getElementById("special");
  const nameInput = document.getElementById("name");
  const amountInput = document.getElementById("amount");
  const factsCheckbox = document.getElementById("facts");

  selectedMode = modeSelect.value;
  specialMode = specialSelect.value;
  showFacts = factsCheckbox.checked;
  totalQuestions = parseInt(amountInput.value) || countries.length;

  playerName = nameInput.value.trim();
  if (!playerName) {
    playerName = randomNames[Math.floor(Math.random() * randomNames.length)];
  }

  document.getElementById("intro").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  document.getElementById("modeDisplay").textContent = `Modus: ${selectedMode} | Spezial: ${specialMode}`;
  document.getElementById("playerDisplay").textContent = `Spieler: ${playerName}`;
  document.getElementById("timer").textContent = "🕒 0 Sekunden";
  score = 0;
  currentIndex = 0;
  lives = 1; // for sudden death
  questions = shuffle(countries).slice(0, totalQuestions);
  startTimer();
  showQuestion();
}

function showQuestion() {
  const q = questions[currentIndex];
  const prompt = document.getElementById("prompt");
  const input = document.getElementById("answerInput");
  const options = document.getElementById("answerOptions");
  const feedback = document.getElementById("feedback");

  feedback.textContent = "";
  input.value = "";
  input.style.display = selectedMode === "capital" && specialMode === "type" ? "block" : "none";
  options.innerHTML = "";

  let questionText = "";
  let correct = "";

  if (selectedMode === "capital") {
    questionText = `Was ist die Hauptstadt von ${q.country}?`;
    correct = q.capital;
  } else if (selectedMode === "population") {
    questionText = `Welches Land hat mehr Einwohner: ${q.country} oder ...?`;
    correct = q.country;
  } else if (selectedMode === "area") {
    questionText = `Welches Land ist flächenmäßig größer: ${q.country} oder ...?`;
    correct = q.country;
  } else if (selectedMode === "gdp") {
    questionText = `Welches Land hat das höhere BIP: ${q.country} oder ...?`;
    correct = q.country;
  }

  prompt.textContent = questionText;

  if (selectedMode === "capital" && specialMode !== "type") {
    const choices = shuffle([q.capital, ...shuffle(countries).slice(0, 3).map(c => c.capital)]);
    choices.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c;
      btn.onclick = () => checkAnswer(c);
      options.appendChild(btn);
    });
  } else if (specialMode === "type") {
    input.onchange = () => checkAnswer(input.value);
  } else {
    const other = shuffle(countries.filter(c => c.country !== q.country))[0];
    const correctValue = q[selectedMode];
    const otherValue = other[selectedMode];
    const isCorrect = correctValue >= otherValue ? q.country : other.country;

    const pair = shuffle([q.country, other.country]);
    pair.forEach(c => {
      const btn = document.createElement("button");
      btn.textContent = c;
      btn.onclick = () => checkAnswer(c, isCorrect, q, other);
      options.appendChild(btn);
    });
  }
}

function checkAnswer(answer, correctValue = null, q = null, other = null) {
  const feedback = document.getElementById("feedback");
  let correctAnswer = "";

  if (selectedMode === "capital") {
    correctAnswer = questions[currentIndex].capital.toLowerCase();
    const cleaned = answer.trim().toLowerCase();
    if (specialMode === "type") {
      if (correctAnswer.includes(cleaned) || cleaned.includes(correctAnswer) || levenshteinDistance(cleaned, correctAnswer) <= 2) {
        feedback.textContent = "✅ Richtig!";
        score++;
      } else {
        feedback.textContent = `❌ Falsch! Richtig: ${questions[currentIndex].capital}`;
        if (specialMode === "sudden") {
          endGame();
          return;
        }
      }
    } else {
      if (cleaned === correctAnswer.toLowerCase()) {
        feedback.textContent = "✅ Richtig!";
        score++;
      } else {
        feedback.textContent = `❌ Falsch! Richtig: ${questions[currentIndex].capital}`;
        if (specialMode === "sudden") {
          endGame();
          return;
        }
      }
    }
  } else {
    if (answer === correctValue) {
      feedback.textContent = "✅ Richtig!";
      score++;
    } else {
      feedback.textContent = `❌ Falsch! Richtige Antwort: ${correctValue}`;
      if (specialMode === "sudden") {
        endGame();
        return;
      }
    }

    if (showFacts && q && other) {
      feedback.textContent += `\n${q.country}: ${q[selectedMode].toLocaleString()} | ${other.country}: ${other[selectedMode].toLocaleString()}`;
    }
  }

  currentIndex++;
  if (currentIndex >= questions.length) {
    endGame();
  } else {
    setTimeout(showQuestion, 1000);
  }
}

function endGame() {
  stopTimer();
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("summary").textContent = `🎉 ${playerName}, du hast ${score} von ${questions.length} Punkten in ${elapsedTime} Sekunden erreicht.`;
}

function restartGame() {
  document.getElementById("result").style.display = "none";
  document.getElementById("intro").style.display = "block";
}

// Hilfsfunktion für Tippfehlertoleranz
function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;
    }
  }
  return dp[a.length][b.length];
}
