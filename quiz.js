// Länder & Hauptstädte nach Regionen
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



const randomNames = [
  "Anna", "Ben", "Lena", "Paul", "Mia", "Noah", "Emma", "Elias", "Sophie", "Luca",
  "Marie", "Leon", "Laura", "Finn", "Nina", "Max", "Lea", "Tom", "Julia", "Jonas"
];

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

// --- Funktionen ---
function startGame(selectedMode) {
  mode = selectedMode;
  const inputCount = document.getElementById("question-count").value;
  const region = document.getElementById("region-select").value;
  const playerInput = document.getElementById("player-name").value;
  specialMode = document.getElementById("special-mode").value;

  // Zufallsnamen, wenn leer
  player = playerInput.trim() || getRandomName();

  // Länder nach Region laden
  countries = getCountriesByRegion(region);
  keys = Object.keys(countries);
  maxQuestions = inputCount ? parseInt(inputCount) : keys.length;
  keys = shuffle([...keys]).slice(0, maxQuestions);

  reverse = (specialMode === "reverse");
  lives = (specialMode === "lifes") ? 3 : 0;

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  document.getElementById("result-screen").style.display = "none";

  score = 0;
  currentIndex = 0;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  document.getElementById("lives-display").innerText = (lives > 0) ? `❤️ Leben: ${lives}` : "";

  nextQuestion();
}

function getCountriesByRegion(region) {
  if (region === "world") {
    let combined = {};
    for (const reg in allCountries) {
      Object.assign(combined, allCountries[reg]);
    }
    return combined;
  } else {
    const regKey = region.charAt(0).toUpperCase() + region.slice(1);
    return allCountries[regKey] || {};
  }
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

  let land = keys[currentIndex];
  let hauptstadt = countries[land];
  let frage = reverse
    ? `Welches Land hat die Hauptstadt "${hauptstadt}"?`
    : `Was ist die Hauptstadt von ${land}?`;

  document.getElementById("question-box").innerText = frage;

  if (mode === "multiple") {
    const correctAnswer = reverse ? land : hauptstadt;
    const options = shuffle([correctAnswer, ...getRandomAnswers(correctAnswer)]);
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
        checkAnswer("", reverse ? land : hauptstadt);
      }
    }, 10000);
  }
}

function getRandomAnswers(correct) {
  const pool = reverse ? Object.keys(countries) : Object.values(countries);
  return shuffle(pool.filter(a => a !== correct)).slice(0, 3);
}

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function checkAnswer(given, correct) {
  const normalizedGiven = normalize(given.trim());
  const normalizedCorrect = normalize(correct);

  let isCorrect = false;
  if (normalizedGiven === normalizedCorrect) isCorrect = true;
  else if (normalizedCorrect.includes(normalizedGiven) && normalizedGiven.length >= 4) isCorrect = true;

  const box = document.getElementById("answer-box");

  if (isCorrect) {
    score++;
    currentIndex++;
    nextQuestion(); // gleich zur nächsten
    return;
  } else {
    if (specialMode === "lifes") {
      lives--;
      document.getElementById("lives-display").innerText = `❤️ Leben: ${lives}`;
    }
  }

  currentIndex++;
  document.getElementById("next-button").style.display = "inline-block";

  const msg = document.createElement("p");
  msg.innerText = `❌ Falsch! Die richtige Antwort ist: ${correct}`;
  msg.style.fontWeight = "bold";
  box.appendChild(msg);
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  const seconds = Math.floor((Date.now() - startTime) / 1000);

  document.getElementById("score-text").innerText = `${player}, du hast ${score} von ${keys.length} richtig beantwortet.`;
  document.getElementById("time-text").innerText = `⏱️ Zeit: ${seconds} Sekunden`;

  document.getElementById("surprise-text").innerText =
    (score === keys.length) ? "🎉 Perfekt! Du bist ein Hauptstadt-Profi! 🌟" : "";
}

function restartGame() {
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "block";
  document.getElementById("timer").innerText = "🕒 0 Sekunden";
  document.getElementById("lives-display").innerText = "";
  document.getElementById("question-count").value = "";
  document.getElementById("player-name").value = "";
  document.getElementById("special-mode").value = "normal";
  document.getElementById("region-select").value = "world";
  score = 0;
  currentIndex = 0;
  reverse = false;
  lives = 0;
}

function getRandomName() {
  const names = ["Anna", "Ben", "Clara", "David", "Eva", "Felix", "Greta", "Hannah", "Jan", "Lina", "Milo", "Nina"];
  return names[Math.floor(Math.random() * names.length)];
}

// --- Event Listener ---
document.getElementById("start-multiple").addEventListener("click", () => startGame("multiple"));
document.getElementById("start-input").addEventListener("click", () => startGame("input"));
document.getElementById("next-button").addEventListener("click", () => nextQuestion());
document.getElementById("restart-button").addEventListener("click", () => restartGame());
