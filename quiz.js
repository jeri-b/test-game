const allCountries = {
  Europe: {
    "Deutschland": "Berlin",
    "Frankreich": "Paris",
    "Italien": "Rom",
    "Spanien": "Madrid",
    "Österreich": "Wien",
    "Schweiz": "Bern",
    "Niederlande": "Amsterdam",
    "Belgien": "Brüssel",
    "Portugal": "Lissabon",
    "Griechenland": "Athen",
    "Dänemark": "Kopenhagen",
    "Schweden": "Stockholm",
    "Norwegen": "Oslo",
    "Finnland": "Helsinki",
    "Polen": "Warschau",
    "Tschechien": "Prag",
    "Ungarn": "Budapest",
    "Rumänien": "Bukarest",
    "Bulgarien": "Sofia",
    "Kroatien": "Zagreb",
    "Serbien": "Belgrad"
  },
  America: {
    "USA": "Washington",
    "Kanada": "Ottawa",
    "Brasilien": "Brasília",
    "Argentinien": "Buenos Aires",
    "Mexiko": "Mexiko-Stadt"
  },
  Asia: {
    "China": "Peking",
    "Japan": "Tokio",
    "Indien": "Neu-Delhi"
  },
  Africa: {
    "Ägypten": "Kairo",
    "Nigeria": "Abuja",
    "Südafrika": "Pretoria",
    "Kenia": "Nairobi"
  }
};

let countries = {};
let keys = [];
let currentIndex = 0;
let score = 0;
let player = "";
let mode = "";
let maxQuestions = 0;
let startTime;
let timerInterval;
let specialMode = "normal";
let lives = 3;
let reverse = false;

function startGame(selectedMode) {
  mode = selectedMode;
  const inputCount = document.getElementById("question-count").value;
  const region = document.getElementById("region-select").value;
  const playerInput = document.getElementById("player-name").value;
  specialMode = document.getElementById("special-mode").value;

  if (!playerInput.trim()) {
    alert("Bitte gib deinen Namen ein.");
    return;
  }

  player = playerInput.trim();

  countries = {};
  if (region === "world") {
    for (const reg in allCountries) {
      Object.assign(countries, allCountries[reg]);
    }
  } else {
    const regKey = region.charAt(0).toUpperCase() + region.slice(1);
    countries = allCountries[regKey] || {};
  }

  keys = Object.keys(countries);
  maxQuestions = inputCount ? parseInt(inputCount) : keys.length;
  keys = shuffle([...keys]).slice(0, maxQuestions);

  if (specialMode === "reverse") reverse = true;
  if (specialMode === "lifes") lives = 3;

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  nextQuestion();
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").innerText = `🕒 ${seconds} Sekunden`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nextQuestion() {
  document.getElementById("next-button").style.display = "none";
  const box = document.getElementById("answer-box");
  box.innerHTML = "";

  if (currentIndex >= keys.length || (specialMode === "lifes" && lives <= 0)) {
    return endGame();
  }

  const land = keys[currentIndex];
  const hauptstadt = countries[land];

  let frage = reverse ? `Zu welcher Stadt gehört das Land "${hauptstadt}"?` : `Was ist die Hauptstadt von ${land}?`;
  document.getElementById("question-box").innerText = frage;

  if (mode === "multiple") {
    let options = shuffle([hauptstadt, ...getRandomCities(hauptstadt)]);
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(opt, hauptstadt);
      box.appendChild(btn);
    });
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Deine Antwort";
    input.id = "text-input";
    input.style.marginTop = "15px";
    box.appendChild(input);

    const submit = document.createElement("button");
    submit.innerText = "Antwort prüfen";
    submit.onclick = () => checkAnswer(input.value, hauptstadt);
    box.appendChild(submit);
  }

  if (specialMode === "blitz") {
    setTimeout(() => {
      if (document.getElementById("next-button").style.display === "none") {
        checkAnswer("", hauptstadt);
      }
    }, 10000);
  }
}

function getRandomCities(correct) {
  const vals = Object.values(countries).filter(c => c !== correct);
  return shuffle(vals).slice(0, 3);
}

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function checkAnswer(given, correct) {
  const isCorrect = normalize(given).includes(normalize(correct).substring(0, 4));
  if (isCorrect) score++;
  else if (specialMode === "lifes") lives--;

  currentIndex++;
  document.getElementById("next-button").style.display = "inline-block";

  const box = document.getElementById("answer-box");
  const msg = document.createElement("p");
  msg.innerText = isCorrect ? "✅ Richtig!" : `❌ Falsch! Richtig wäre: ${correct}`;
  msg.style.fontWeight = "bold";
  box.appendChild(msg);
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("score-text").innerText = `${player}, du hast ${score} von ${keys.length} richtig.`;
  document.getElementById("time-text").innerText = `⏱️ Zeit: ${seconds} Sekunden`;

  const best = localStorage.getItem("hauptstadtquiz_best");
  const thisResult = `${score} Punkte in ${seconds} Sek.`;

  if (!best || score > parseInt(best.split(" ")[0])) {
    localStorage.setItem("hauptstadtquiz_best", thisResult);
    document.getElementById("best-result").innerText = `🏅 Neuer Highscore! (${thisResult})`;
  } else {
    document.getElementById("best-result").innerText = `🔁 Bester Versuch bisher: ${best}`;
  }
}
