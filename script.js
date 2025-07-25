let storyBox, choicesBox, compassBox;
let points = { conrad: 0, jeremiah: 0 };
let currentStep = 0;

function startGame() {
  document.getElementById("intro-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  storyBox = document.getElementById("story-box");
  choicesBox = document.getElementById("choices-box");
  compassBox = document.getElementById("compass-box");
  showStep(currentStep);
}

const story = [
  {
    text: "🌅 Kapitel 1: Cousins Beach ruft\nDu kommst am Strandhaus an. Susannah umarmt dich herzlich. 💛 Jeremiah ruft: 'Endlich bist du da!' 💙 Conrad steht abseits mit einem Buch.",
    choices: [
      { text: "Jeremiah stürmisch begrüßen 💛", effect: { jeremiah: 1 }, lock: "conrad" },
      { text: "Conrad vorsichtig zunicken 💙", effect: { conrad: 1 }, lock: "jeremiah" }
    ]
  },
  {
    text: "🌊 Kapitel 2: Erste Nähe\nAbends fragt Jeremiah, ob ihr Sterne zählen wollt. Conrad fragt, ob du Musik hören willst.",
    choices: [
      { text: "Mit Jeremiah aufs Dach klettern 🌟", effect: { jeremiah: 2 }, lock: "conrad" },
      { text: "Conrads Musik teilen 🎶", effect: { conrad: 2 }, lock: "jeremiah" }
    ]
  },
  {
    text: "🎉 Kapitel 3: Gartenparty\nTaylor schlägt vor, bei der Party ein Kleid zu tragen, das einen der Jungs beeindrucken könnte.",
    choices: [
      { text: "Jeremiahs Geschmack wählen 💛", effect: { jeremiah: 1 }, lock: "conrad" },
      { text: "Conrads Stil imitieren 💙", effect: { conrad: 1 }, lock: "jeremiah" },
      { text: "Etwas Unabhängiges tragen 🌤️", effect: {} }
    ]
  },
  {
    text: "🔥 Kapitel 4: Lagerfeuer-Drama\nJeremiah flirtet offen. Conrad zieht sich zurück. Du stehst zwischen beiden.",
    choices: [
      { text: "Jeremiah zurückflirten 😉", effect: { jeremiah: 2 }, lock: "conrad" },
      { text: "Conrad ansprechen – was los ist?", effect: { conrad: 2 }, lock: "jeremiah" },
      { text: "Beide ignorieren und tanzen gehen 💃", effect: {} }
    ]
  },
  {
    text: "💃 Kapitel 5: Der Debütantinnenball\nDu darfst deinen ersten Tanzpartner wählen.",
    choices: [
      { text: "Jeremiah – er ist dein sicherer Hafen 💛", effect: { jeremiah: 3 }, lock: "conrad" },
      { text: "Conrad – auch wenn es kompliziert ist 💙", effect: { conrad: 3 }, lock: "jeremiah" }
    ]
  },
  {
    text: "😢 Kapitel 6: Streit am Morgen\nDu hörst, wie sie sich wegen dir streiten.",
    choices: [
      { text: "Du gehst dazwischen – genug ist genug!", effect: {} },
      { text: "Du sprichst danach mit Conrad allein 💙", effect: { conrad: 1 }, lock: "jeremiah" },
      { text: "Du tröstest Jeremiah 💛", effect: { jeremiah: 1 }, lock: "conrad" }
    ]
  },
  {
    text: "📚 Kapitel 7: Collegepläne\nJeremiah lädt dich zu seinem Campus ein. Conrad sagt, er fährt nach Brown.",
    choices: [
      { text: "Mit Jeremiah mitfahren 💛", effect: { jeremiah: 2 }, lock: "conrad" },
      { text: "Conrad begleiten 💙", effect: { conrad: 2 }, lock: "jeremiah" },
      { text: "Allein bleiben – Zeit für dich 🌤️", effect: {} }
    ]
  },
  {
    text: "🚗 Kapitel 8: Abschied oder Anfang\nDu sitzt am Busbahnhof. Beide kommen gleichzeitig.",
    choices: [
      { text: "Jeremiah küssen 💛", effect: { jeremiah: 5 }, lock: "conrad" },
      { text: "Conrads Hand nehmen 💙", effect: { conrad: 5 }, lock: "jeremiah" },
      { text: "Beiden sagen, du brauchst Abstand", effect: {} }
    ]
  }
];

function showStep(step) {
  const scene = story[step];
  storyBox.textContent = scene.text;
  choicesBox.innerHTML = "";
  updateCompass();

  const lockThreshold = 3;
  const diff = Math.abs(points.conrad - points.jeremiah);
  const lockedSide = points.conrad > points.jeremiah ? "jeremiah" : points.jeremiah > points.conrad ? "conrad" : null;

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    const shouldLock = step >= 5 && lockedSide && choice.lock === lockedSide && diff >= lockThreshold;

    if (shouldLock) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else {
      btn.onclick = () => {
        points.conrad += choice.effect.conrad || 0;
        points.jeremiah += choice.effect.jeremiah || 0;
        currentStep++;
        if (currentStep < story.length) {
          showStep(currentStep);
        } else {
          showEnding();
        }
      };
    }
    choicesBox.appendChild(btn);
  });
}

function updateCompass() {
  if (points.conrad > points.jeremiah) {
    compassBox.textContent = "Aktueller Fokus: 💙 Conrad";
  } else if (points.jeremiah > points.conrad) {
    compassBox.textContent = "Aktueller Fokus: 💛 Jeremiah";
  } else {
    compassBox.textContent = "Aktueller Fokus: 🌤️ neutral";
  }
}

function showEnding() {
  let endingText = "";
  const total = points.conrad + points.jeremiah;
  const ratio = total === 0 ? 0 : Math.max(points.conrad, points.jeremiah) / total;

  if (points.conrad > points.jeremiah) {
    endingText = "💙 Du hast dich für Conrad entschieden. Eure Geschichte ist tief, ehrlich und manchmal schmerzhaft – aber echt.";
    if (ratio >= 0.9) endingText += "\n\n🎁 Überraschung: Conrad schenkt dir sein Lieblingsbuch mit einer handgeschriebenen Notiz.";
  } else if (points.jeremiah > points.conrad) {
    endingText = "💛 Jeremiah war immer da – leicht, fröhlich und voller Herz. Du wählst die Wärme.";
    if (ratio >= 0.9) endingText += "\n\n🎁 Überraschung: Jeremiah hält ein selbstgemachtes Armband hoch – mit deinem Namen.";
  } else {
    endingText = "🌤️ Du bist deinen eigenen Weg gegangen. Kein Sommer der Liebe – sondern einer der Selbstfindung.";
  }

  storyBox.textContent = endingText;
  compassBox.textContent = "💌 Danke fürs Spielen!";
  choicesBox.innerHTML = "";
}
