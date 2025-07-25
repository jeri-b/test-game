let storyBox = document.getElementById("story-box");
let choicesBox = document.getElementById("choices-box");

let points = {
  conrad: 0,
  jeremiah: 0
};

let currentStep = 0;

const story = [
  {
    text: "🌅 Kapitel 1: Ankunft in Cousins Beach.\nDu steigst aus dem Auto. Die Sonne scheint. Susannah winkt dir. Conrad lehnt am Geländer. Jeremiah läuft lachend auf dich zu.",
    choices: [
      { text: "Jeremiah fest umarmen.", effect: { jeremiah: 1 } },
      { text: "Conrad vorsichtig zulächeln.", effect: { conrad: 1 } }
    ]
  },
  {
    text: "Abends fragt Jeremiah, ob du mit ihm schwimmen gehst. Conrad spielt Gitarre auf der Veranda.",
    choices: [
      { text: "Mit Jeremiah zum Strand gehen.", effect: { jeremiah: 1 } },
      { text: "Still Conrad zuhören.", effect: { conrad: 1 } }
    ]
  },
  {
    text: "🌊 Kapitel 2: Gefühle in Bewegung.\nDu wachst früh auf. Am Küchentisch sitzt nur Conrad mit einer Tasse Tee.",
    choices: [
      { text: "Setz dich zu ihm und schweige mit ihm.", effect: { conrad: 1 } },
      { text: "Sag nur kurz Hallo und geh raus.", effect: {} }
    ]
  },
  {
    text: "Später läuft Jeremiah zu dir und fragt, ob du Lust hast, Paddleboard zu fahren.",
    choices: [
      { text: "Klar! Abenteuerzeit!", effect: { jeremiah: 1 } },
      { text: "Lieber chillen – vielleicht liest Conrad ja draußen.", effect: { conrad: 1 } }
    ]
  },
  {
    text: "🎀 Kapitel 3: Der Debütantinnenball rückt näher.\nTaylor will dir beim Kleid aussuchen helfen. Du spürst Nervosität.",
    choices: [
      { text: "Frag Taylor, was Jeremiah gut fände.", effect: { jeremiah: 1 } },
      { text: "Frag Taylor, ob sie weiß, ob Conrad überhaupt kommt.", effect: { conrad: 1 } }
    ]
  },
  {
    text: "Der Ballabend ist da. Beide Brüder sehen umwerfend aus. Du darfst deinen ersten Tanz wählen.",
    choices: [
      { text: "Jeremiah direkt fragen – er hat dich immer unterstützt.", effect: { jeremiah: 2 } },
      { text: "Zögere kurz – und frage Conrad leise.", effect: { conrad: 2 } }
    ]
  },
  {
    text: "💔 Kapitel 4: Entscheidungen mit Folgen.\nNach dem Ball gehst du allein zum Steg. Jeremiah folgt dir, will wissen, wie du dich fühlst.",
    choices: [
      { text: "Sag ihm ehrlich, dass du verwirrt bist.", effect: {} },
      { text: "Sag, dass du Zeit brauchst – und ihm nicht wehtun willst.", effect: { jeremiah: -1 } }
    ]
  },
  {
    text: "Zurück im Haus steht Conrad in deinem Zimmer. Er schaut dich an – fragend.",
    choices: [
      { text: "Umarme ihn, ohne zu reden.", effect: { conrad: 2 } },
      { text: "Sag ihm, dass du nicht zwischen ihnen stehen willst.", effect: {} }
    ]
  }
];

function showStep(step) {
  const scene = story[step];
  storyBox.textContent = scene.text;
  choicesBox.innerHTML = "";

  scene.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
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
    choicesBox.appendChild(btn);
  });
}

function showEnding() {
  let endingText = "";

  if (points.conrad > points.jeremiah) {
    endingText = "💙 Du hast dich für Conrad entschieden. Vielleicht ist Liebe manchmal leise – aber tief.";
  } else if (points.jeremiah > points.conrad) {
    endingText = "💛 Du und Jeremiah – Lachen, Nähe, Wärme. Es fühlt sich leicht an. Und echt.";
  } else {
    endingText = "🌤️ Du hast niemanden gewählt – außer dich selbst. Und das ist auch okay. Manchmal ist das der mutigste Weg.";
  }

  storyBox.textContent = endingText;
  choicesBox.innerHTML = "";
}

showStep(currentStep);
