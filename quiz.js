const countries = {
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
  "USA": "Washington",
  "Kanada": "Ottawa",
  "Brasilien": "Brasília",
  "Argentinien": "Buenos Aires",
  "Mexiko": "Mexiko-Stadt",
  "China": "Peking",
  "Japan": "Tokio",
  "Indien": "Neu-Delhi",
  "Australien": "Canberra",
  "Neuseeland": "Wellington",
};

let keys = Object.keys(countries);
let currentIndex = 0;
let score = 0;
let mode = "";
let maxQuestions = 0;
let startTime;
let timerInterval;

function startGame(selectedMode) {
  mode = selectedMode;
  const inputCount = document.getElementById("question-count").value;
  maxQuestions = inputCount ? parseInt(inputCount) : keys.length;
  keys = shuffle([...keys]).slice(0, maxQuestions);
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  nextQuestion();
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").innerText = "🕒 " + seconds + " Sekunden";
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function nextQuestion() {
  document.getElementById("next-button").style.display = "none";
  if (currentIndex >= keys.length) return endGame();
  const land = keys[currentIndex];
  const hauptstadt = countries[land];
  document.getElementById("question-box").innerText = `Was ist die Hauptstadt von ${land}?`;
  const box = document.getElementById("answer-box");
  box.innerHTML = "";

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
}

function getRandomCities(correct) {
  let vals = Object.values(countries).filter(c => c !== correct);
  return shuffle(vals).slice(0, 3);
}

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function checkAnswer(given, correct) {
  const isCorrect = normalize(given).includes(normalize(correct).substring(0, 4));
  if (isCorrect) score++;
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
  document.getElementById("score-text").innerText = `Du hast ${score} von ${keys.length} richtig.`;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("time-text").innerText = `⏱️ Zeit: ${seconds} Sekunden`;
}
