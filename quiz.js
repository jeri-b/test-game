// Alle Länder & Hauptstädte, sortiert nach Regionen
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
    "Serbien": "Belgrad",
    "Irland": "Dublin",
    "Island": "Reykjavik",
    "Slowakei": "Bratislava",
    "Slowenien": "Ljubljana",
    "Estland": "Tallinn",
    "Lettland": "Riga",
    "Litauen": "Vilnius",
    "Moldawien": "Chisinau",
    "Albanien": "Tirana",
    "Nordmazedonien": "Skopje",
    "Bosnien und Herzegowina": "Sarajevo",
    "Weißrussland": "Minsk",
    "Ukraine": "Kiew",
    "Luxemburg": "Luxemburg",
    "Malta": "Valletta",
    "Monaco": "Monaco",
    "Liechtenstein": "Vaduz",
    "Andorra": "Andorra la Vella",
    "San Marino": "San Marino",
    "Vatikanstadt": "Vatikanstadt"
  },
  America: {
    "USA": "Washington",
    "Kanada": "Ottawa",
    "Brasilien": "Brasília",
    "Argentinien": "Buenos Aires",
    "Mexiko": "Mexiko-Stadt",
    "Kolumbien": "Bogotá",
    "Chile": "Santiago",
    "Peru": "Lima",
    "Venezuela": "Caracas",
    "Ecuador": "Quito",
    "Bolivien": "Sucre",
    "Paraguay": "Asunción",
    "Uruguay": "Montevideo",
    "Costa Rica": "San José",
    "Kuba": "Havanna",
    "Dominikanische Republik": "Santo Domingo",
    "Honduras": "Tegucigalpa",
    "Guatemala": "Guatemala-Stadt",
    "Nicaragua": "Managua",
    "Panama": "Panama-Stadt"
  },
  Asia: {
    "China": "Peking",
    "Japan": "Tokio",
    "Indien": "Neu-Delhi",
    "Russland": "Moskau",
    "Indonesien": "Jakarta",
    "Saudi-Arabien": "Riad",
    "Südkorea": "Seoul",
    "Malaysia": "Kuala Lumpur",
    "Vietnam": "Hanoi",
    "Thailand": "Bangkok",
    "Philippinen": "Manila",
    "Irak": "Bagdad",
    "Iran": "Teheran",
    "Israel": "Jerusalem",
    "Libanon": "Beirut",
    "Jordanien": "Amman",
    "Türkei": "Ankara",
    "Pakistan": "Islamabad",
    "Bangladesch": "Dhaka",
    "Singapur": "Singapur",
    "Katar": "Doha",
    "Nepal": "Kathmandu",
    "Sri Lanka": "Sri Jayawardenepura Kotte",
    "Mongolei": "Ulaanbaatar"
  },
  Africa: {
    "Ägypten": "Kairo",
    "Nigeria": "Abuja",
    "Südafrika": "Pretoria",
    "Kenia": "Nairobi",
    "Algerien": "Algier",
    "Marokko": "Rabat",
    "Tunesien": "Tunis",
    "Sudan": "Khartum",
    "Äthiopien": "Addis Abeba",
    "Ghana": "Accra",
    "Tansania": "Dodoma",
    "Uganda": "Kampala",
    "Angola": "Luanda",
    "Mosambik": "Maputo",
    "Madagaskar": "Antananarivo",
    "Kamerun": "Jaunde",
    "Elfenbeinküste": "Yamoussoukro",
    "Senegal": "Dakar",
    "Botswana": "Gaborone",
    "Namibia": "Windhoek",
    "Zambia": "Lusaka",
    "Zimbabwe": "Harare"
  }
};

// Globale Variablen
let countries = {};
let keys = [];
let currentIndex = 0;
let score = 0;
let player = "";
let mode = ""; // "multiple" oder "input"
let maxQuestions = 0;
let startTime;
let timerInterval;
let specialMode = "normal"; // normal, blitz, lifes, reverse
let lives = 3;
let reverse = false;

// --- Funktionen ---

function startGame(selectedMode) {
  mode = selectedMode;
  const inputCount = document.getElementById("question-count").value;
  const region = document.getElementById("region-select").value;
const playerInput = document.getElementById("player-name").value.trim();
specialMode = document.getElementById("special-mode").value;

const randomNames = [
  "Anna", "Lukas", "Marie", "Johannes", "Emma",
  "Gimi", "Lea", "JB", "Sophie", "Finn",
  "Mia", "Noah", "Jonas", "Laura", "Tim",
  "Nina", "Felix", "Lena", "Tom", "Jana"
];

player = playerInput || randomNames[Math.floor(Math.random() * randomNames.length)];
  
const playerInput = document.getElementById("player-name").value.trim();
player = playerInput || randomNames[Math.floor(Math.random() * randomNames.length)];
    return;
  }
  player = playerInput.trim();

  // Länder laden nach Region
  countries = {};
  if (region === "world") {
    for (const reg in allCountries) {
      Object.assign(countries, allCountries[reg]);
    }
  } else {
    // Großschreibung erste Buchstabe
    const regKey = region.charAt(0).toUpperCase() + region.slice(1);
    countries = allCountries[regKey] || {};
  }

  keys = Object.keys(countries);
  maxQuestions = inputCount ? parseInt(inputCount) : keys.length;
  keys = shuffle([...keys]).slice(0, maxQuestions);

  reverse = false;
  lives = 3;
  if (specialMode === "reverse") reverse = true;
  if (specialMode === "lifes") lives = 3;

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  document.getElementById("result-screen").style.display = "none";

  score = 0;
  currentIndex = 0;
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

  let frage = "";
  let land = keys[currentIndex];
  let hauptstadt = countries[land];

  if (reverse) {
    // Frage: Stadt vorgegeben, Land gesucht
    frage = `Welches Land hat die Hauptstadt "${hauptstadt}"?`;
  } else {
    frage = `Was ist die Hauptstadt von ${land}?`;
  }

  document.getElementById("question-box").innerText = frage;

  if (mode === "multiple") {
    let correctAnswer = reverse ? land : hauptstadt;
    let options = shuffle([correctAnswer, ...getRandomAnswers(correctAnswer)]);
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(opt, correctAnswer);
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
    submit.onclick = () => {
      const val = document.getElementById("text-input").value;
      checkAnswer(val, reverse ? land : hauptstadt);
    };
    box.appendChild(submit);
  }

  if (specialMode === "blitz") {
    setTimeout(() => {
      if (document.getElementById("next-button").style.display === "none") {
        // Zeit abgelaufen, Antwort leer
        checkAnswer("", reverse ? land : hauptstadt);
      }
    }, 10000);
  }
}

function getRandomAnswers(correct) {
  // 3 falsche Antworten rausfiltern
  let allAnswers = reverse ? Object.keys(countries) : Object.values(countries);
  allAnswers = allAnswers.filter(a => a !== correct);
  return shuffle(allAnswers).slice(0, 3);
}

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function checkAnswer(given, correct) {
  given = given.trim();
  const normalizedGiven = normalize(given);
  const normalizedCorrect = normalize(correct);

  // Kleine Toleranz: Antwort gilt als richtig, wenn:
  // - sie gleich ist (normalisiert)
  // - oder die Antwort einen großen Teil des korrekten Namens enthält (4 Zeichen)
  // Beispiel: "berlin" vs "berlin", "berl" reicht
  let isCorrect = false;
  if (normalizedGiven === normalizedCorrect) isCorrect = true;
  else if (
    normalizedCorrect.includes(normalizedGiven) && normalizedGiven.length >= 4
  ) isCorrect = true;

  if (isCorrect) {
    score++;
  } else if (specialMode === "lifes") {
    lives--;
  }

  currentIndex++;
  document.getElementById("next-button").style.display = "inline-block";

  const box = document.getElementById("answer-box");
  const msg = document.createElement("p");
  msg.innerText = isCorrect
    ? "✅ Richtig!"
    : `❌ Falsch! Die richtige Antwort ist: ${correct}`;
  msg.style.fontWeight = "bold";
  box.appendChild(msg);

  if (specialMode === "lifes") {
    const livesDisplay = document.getElementById("lives-display");
    if (livesDisplay) livesDisplay.innerText = `❤️ Leben: ${lives}`;
  }
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  const seconds = Math.floor((Date.now() - startTime) / 1000);

  document.getElementById("score-text").innerText = `${player}, du hast ${score} von ${keys.length} richtig beantwortet.`;
  document.getElementById("time-text").innerText = `⏱️ Zeit: ${seconds} Sekunden`;

  // Überraschung, wenn 100% Punkte
  if (score === keys.length) {
    document.getElementById("surprise-text").innerText =
      "🎉 Perfekt! Du bist ein Hauptstadt-Profi! 🌟";
  } else {
    document.getElementById("surprise-text").innerText = "";
  }
}

function restartGame() {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("timer").innerText = "🕒 0 Sekunden";
  document.getElementById("lives-display").innerText = "";
  // Felder zurücksetzen optional
  document.getElementById("question-count").value = "";
  document.getElementById("player-name").value = "";
  document.getElementById("special-mode").value = "normal";
  document.getElementById("region-select").value = "world";
  score = 0;
  currentIndex = 0;
  reverse = false;
  lives = 3;
}

// --- Eventlistener für Buttons ---
document.getElementById("start-multiple").addEventListener("click", () => startGame("multiple"));
document.getElementById("start-input").addEventListener("click", () => startGame("input"));
document.getElementById("next-button").addEventListener("click", () => nextQuestion());
document.getElementById("restart-button").addEventListener("click", () => restartGame());
