// COORDONNÉES EXACTES DES VILLES
const CITIES = {
  "Paris": { x: 25, y: 50, capital: true },
  "Marseille": { x: 30, y: 63, capital: false },
  "Lyon": { x: 27, y: 57, capital: false },
  "Strasbourg": { x: 32, y: 50, capital: false },
  "Bordeaux": { x: 20, y: 61, capital: false },
  "Lille": { x: 24, y: 45, capital: false },
  "Londres": { x: 19, y: 42, capital: true },
  "Dublin": { x: 11, y: 37, capital: true },
  "Amsterdam": { x: 27.5, y: 39, capital: true },
  "Bruxelles": { x: 27.8, y: 44, capital: true },
  "Berlin": { x: 39, y: 38, capital: true },
  "Vienne": { x: 43, y: 52, capital: true },
  "Madrid": { x: 19, y: 69, capital: true },
  "Lisbonne": { x: 7.8, y: 71, capital: true },
  "Rome": { x: 38, y: 63, capital: true },
  "Varsovie": { x: 54, y: 41, capital: true },
  "Athènes": { x: 55, y: 78, capital: true },
  "Kyiv": { x: 67, y: 45, capital: true },
  "Moscou": { x: 76, y: 30, capital: true }
};

// BANQUE D'ÉVÉNEMENTS
const EVENTS = [
  {
    type: "ÉNERGIE & ATOME",
    city: "Lyon",
    title: "Maintenance Critique des Centrales",
    desc: "Plusieurs réacteurs nucléaires nécessitent des réparations d'urgence suite à des fissures.",
    choiceA: { text: "Ne rien faire et repousser les travaux (+50M€ Suisse)", dette: 100, cagnotte: 50, pop: -20, tension: 25, soupcon: 30, multDette: 1.35 },
    choiceB: { text: "Rénover massivement les réacteurs (-50M€ Suisse)", dette: 80, cagnotte: -50, pop: 15, tension: -35, soupcon: -5 }
  },
  {
    type: "CRISE ÉNERGÉTIQUE",
    city: "Berlin",
    title: "Sabotage des Gazoducs Nordiques",
    desc: "L'Allemagne perd ses approvisionnements en gaz. Le prix du mégawatt-heure explose.",
    choiceA: { text: "Relancer le charbon et nationaliser les factures", dette: 95, cagnotte: 0, pop: 10, tension: -15, soupcon: -5 },
    choiceB: { text: "Acheter du gaz liquéfié surfacturé (+55M€ Suisse)", dette: 20, cagnotte: 55, pop: -25, tension: 30, soupcon: 30 }
  },
  {
    type: "INCIDENT MILITAIRE",
    city: "Bordeaux",
    title: "Alerte Secrète à l'Île Longue",
    desc: "Avarie critique sur un sous-marin nucléaire lanceur d'engins dans la base bretonne.",
    choiceA: { text: "Injecter 80 Mds € dans la modernisation urgente", dette: 80, cagnotte: 0, pop: 5, tension: -10, soupcon: -4 },
    choiceB: { text: "Sous-traiter la réparation à une firme privée (+45M€ Suisse)", dette: 15, cagnotte: 45, pop: -20, tension: 25, soupcon: 35 }
  },
  {
    type: "CATASTROPHE NATURELLE",
    city: "Marseille",
    title: "Sécheresse & Incendies Mégalos",
    desc: "Le Sud brûle. Plus d'eau potable au robinet dans trois départements.",
    choiceA: { text: "Envoyer l'armée et indemniser les sinistrés", dette: 60, cagnotte: 0, pop: 15, tension: -20, soupcon: -3 },
    choiceB: { text: "Privatiser la distribution d'eau d'urgence (+35M€ Suisse)", dette: -10, cagnotte: 35, pop: -30, tension: 40, soupcon: 25 }
  },
  {
    type: "TENSION EUROPÉENNE",
    city: "Varsovie",
    title: "Escalade à la Frontière Est",
    desc: "Tensions militaires maximales aux portes de l'Europe. L'OTAN exige des renforts.",
    choiceA: { text: "Déployer 40 000 soldats et commander des munitions", dette: 110, cagnotte: 0, pop: 10, tension: -5, soupcon: -5 },
    choiceB: { text: "Négocier des contrats d'armement avec bonus (+70M€ Suisse)", dette: 30, cagnotte: 70, pop: -20, tension: 20, soupcon: 40 }
  },
  {
    type: "CRISE RÉGIONALE",
    city: "Strasbourg",
    title: "Pénurie Critique de Choucroute",
    desc: "Un déficit de choux et de saucisses met l'Alsace au bord de l'insurrection.",
    choiceA: { text: "Subventionner l'importation massive de choux géants", dette: 30, cagnotte: 0, pop: 15, tension: -20, soupcon: -4 },
    choiceB: { text: "Taxer le Riesling et détourner l'argent (+50M€ Suisse)", dette: 10, cagnotte: 50, pop: -25, tension: 35, soupcon: 30 }
  },
  {
    type: "SERVICES PUBLICS",
    city: "Paris",
    title: "Grève Générale des Éboueurs",
    desc: "Des montagnes de déchets s'accumulent sous les fenêtres des ministères.",
    choiceA: { text: "Céder aux revendications salariales", dette: 35, cagnotte: 0, pop: 15, tension: -25, soupcon: -5 },
    choiceB: { text: "Privatiser le ramassage via une société offshore (+30M€ Suisse)", dette: -10, cagnotte: 30, pop: -25, tension: 35, soupcon: 25 }
  }
];

let state = {
  dette: 3100,
  cagnotte: 0,
  pop: 50,
  tension: 20,
  soupcon: 0,
  mois: 1,
  tauxInteret: 2.5,
  currentEvent: null,
  timerSeconds: 30, // PASSE DE 15 À 30 SECONDES
  cooldown493: 0
};

let timerInterval = null;

// EXÉCUTION GARANTIE
document.addEventListener('DOMContentLoaded', () => {
  renderMapMarkers();
  setupEventListeners();
  displayNextEvent();
});

function renderMapMarkers() {
  const layer = document.getElementById('cities-layer');
  if (!layer) return;
  layer.innerHTML = '';

  for (const [name, data] of Object.entries(CITIES)) {
    const marker = document.createElement('div');
    marker.className = 'city-marker';
    marker.style.left = `${data.x}%`;
    marker.style.top = `${data.y}%`;

    const dot = document.createElement('div');
    dot.className = `dot ${data.capital ? 'capital' : ''}`;

    const label = document.createElement('span');
    label.className = 'cityName';
    label.innerText = name;

    marker.appendChild(dot);
    marker.appendChild(label);
    layer.appendChild(marker);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  state.timerSeconds = 30; // RÉINITIALISÉ À 30 SECONDES À CHAQUE TOUR
  updateTimerUI();

  timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerUI();

    if (state.timerSeconds <= 0) {
      clearInterval(timerInterval);
      state.tension = Math.min(100, state.tension + 15);
      state.pop = Math.max(0, state.pop - 10);
      alert("⏱️ TEMPS ÉCOULÉ ! L'absence de décision du gouvernement provoque la panique (+15% Tension).");
      handleChoice('choiceA');
    }
  }, 1000);
}

function updateTimerUI() {
  const timeElem = document.getElementById('time-val');
  if (timeElem) {
    timeElem.innerText = `Mois ${state.mois} ⏱️ ${state.timerSeconds}s`;
    timeElem.style.color = state.timerSeconds <= 8 ? '#dc2626' : 'inherit';
  }
}

function displayNextEvent() {
  checkGameStatus();

  // ALERTE CAGNOTTE BASSE APRES LE MOIS 3
  if (state.mois > 3 && state.cagnotte < 10) {
    state.soupcon = Math.min(100, state.soupcon + 15);
    state.tension = Math.min(100, state.tension + 10);
    alert("⚠️ AMATEURISME FINANCIER ! Votre compte en Suisse a moins de 10 M€. Vos montages bizarres attirent les soupçons (+15% Soupçon, +10% Tension) !");
  }

  // INTÉRÊTS SUR LA DETTE
  let interetsMensuels = Math.round((state.dette * (state.tauxInteret / 100)) / 12);
  state.dette += interetsMensuels;

  // RECHARGE DU 49.3
  if (state.cooldown493 > 0) state.cooldown493--;
  update493Button();

  // TIRAGE D'UN ÉVÉNEMENT ALÉATOIRE
  const idx = Math.floor(Math.random() * EVENTS.length);
  const ev = EVENTS[idx];
  state.currentEvent = ev;

  // MISE À JOUR DU DOM
  document.getElementById('event-city').innerText = ev.city;
  document.getElementById('event-type').innerText = ev.type;
  document.getElementById('event-title').innerText = ev.title;
  document.getElementById('event-desc').innerText = ev.desc;

  let surcoutTension = state.tension > 70 ? 1.5 : 1.0;

  document.getElementById('text-a').innerText = ev.choiceA.text;
  document.getElementById('impact-a').innerText = formatImpact(ev.choiceA, surcoutTension);

  document.getElementById('text-b').innerText = ev.choiceB.text;
  document.getElementById('impact-b').innerText = formatImpact(ev.choiceB, surcoutTension);

  // VISEUR SUR LA CARTE
  const cityData = CITIES[ev.city];
  const beacon = document.getElementById('target-beacon');
  if (cityData && beacon) {
    beacon.style.left = `${cityData.x}%`;
    beacon.style.top = `${cityData.y}%`;
    beacon.classList.remove('hidden');
  }

  updateHUD(interetsMensuels);
  startTimer();
}

function update493Button() {
  const btn = document.getElementById('btn-493');
  if (!btn) return;

  if (state.cooldown493 === 0) {
    btn.disabled = false;
    btn.innerText = "📜 ENGAGER LE 49.3 (Disponible)";
  } else {
    btn.disabled = true;
    btn.innerText = `📜 49.3 (Recharge : ${state.cooldown493} mois)`;
  }
}

function formatImpact(choice, surcout) {
  let res = [];
  let detteCalculee = Math.round(choice.dette * (choice.multDette || 1) * surcout);
  
  if (detteCalculee !== 0) res.push(`${detteCalculee > 0 ? '+' : ''}${detteCalculee} Mds € Dette`);
  if (choice.cagnotte) res.push(`${choice.cagnotte > 0 ? '+' : ''}${choice.cagnotte} M€ Suisse`);
  
  if (choice.soupcon) {
    if (choice.soupcon > 0) res.push(`⚠️ +${choice.soupcon}% Soupçon`);
    else if (choice.soupcon < 0) res.push(`🛡️ ${choice.soupcon}% Soupçon`);
  }
  
  if (choice.pop !== 0) res.push(`${choice.pop > 0 ? '+' : ''}${choice.pop}% Pop`);
  if (choice.tension !== 0) res.push(`${choice.tension > 0 ? '+' : ''}${choice.tension}% Tension`);
  return res.join(' • ');
}

function setupEventListeners() {
  document.getElementById('choice-a').addEventListener('click', () => handleChoice('choiceA'));
  document.getElementById('choice-b').addEventListener('click', () => handleChoice('choiceB'));

  document.getElementById('btn-493').addEventListener('click', open493Modal);
  document.getElementById('btn-close-493').addEventListener('click', close493Modal);

  document.getElementById('decret-1').addEventListener('click', () => applyDecret(1));
  document.getElementById('decret-2').addEventListener('click', () => applyDecret(2));
  document.getElementById('decret-3').addEventListener('click', () => applyDecret(3));
  document.getElementById('decret-4').addEventListener('click', () => applyDecret(4));
}

function open493Modal() {
  clearInterval(timerInterval);
  document.getElementById('modal-493').classList.remove('hidden');
}

function close493Modal() {
  document.getElementById('modal-493').classList.add('hidden');
  startTimer();
}

function applyDecret(num) {
  document.getElementById('modal-493').classList.add('hidden');
  state.cooldown493 = 6;

  if (num === 1) {
    state.dette = Math.max(0, state.dette - 200);
    state.tension = Math.min(100, state.tension + 35);
    state.pop = Math.max(0, state.pop - 15);
  } else if (num === 2) {
    state.cagnotte += 100;
    state.soupcon = Math.min(100, state.soupcon + 40);
  } else if (num === 3) {
    state.dette = Math.max(0, state.dette - 150);
    state.cagnotte += 50;
    state.tension = Math.min(100, state.tension + 25);
  } else if (num === 4) {
    state.tension = Math.round(state.tension / 2);
    state.dette += 100;
  }

  state.mois += 1;
  displayNextEvent();
}

function handleChoice(key) {
  clearInterval(timerInterval);
  const choice = state.currentEvent[key];

  let surcoutTension = state.tension > 70 ? 1.5 : 1.0;
  let impactDette = choice.dette * (choice.multDette || 1);
  state.dette += Math.round(impactDette * surcoutTension);

  if (choice.cagnotte) state.cagnotte += choice.cagnotte;
  if (choice.soupcon) state.soupcon = Math.max(0, state.soupcon + choice.soupcon);
  
  state.pop = Math.min(100, Math.max(0, state.pop + choice.pop));
  state.tension = Math.min(100, Math.max(0, state.tension + choice.tension));
  
  state.tauxInteret = (2.5 + (state.dette / 2000)).toFixed(1);
  state.mois += 1;

  displayNextEvent();
}

function updateHUD(interets) {
  document.getElementById('dette-val').innerText = `${state.dette} Mds € (+${interets || 0}/m)`;
  document.getElementById('cagnotte-val').innerText = `${state.cagnotte} M€ (Soupçon: ${state.soupcon}%)`;
  document.getElementById('pop-bar').style.width = `${state.pop}%`;
  document.getElementById('pop-val').innerText = `${state.pop}%`;
  document.getElementById('tension-bar').style.width = `${state.tension}%`;
  document.getElementById('tension-val').innerText = `${state.tension}%`;
}

function checkGameStatus() {
  if (state.dette >= 10000 && state.cagnotte >= 250) {
    clearInterval(timerInterval);
    triggerEnd("VICTOIRE TOTALE : LE BRAQUAGE DU SIÈCLE !", `Bravo ! La dette atteint ${state.dette} Mds €, et vous vous envolez pour Zurich avec ${state.cagnotte} M€ !`);
  } else if (state.soupcon >= 100) {
    clearInterval(timerInterval);
    triggerEnd("SCANDALE D'ÉTAT : Disgrâce !", "Votre indice de soupçon a atteint 100%. Mediapart a tout révélé : vous finissez en prison !");
  } else if (state.dette >= 10000) {
    clearInterval(timerInterval);
    triggerEnd("FAILLITE NATIONALE !", `La France est en faillite (${state.dette} Mds € de dette). Votre compte Suisse n'a que ${state.cagnotte} M€ : c'est la faillite totale !`);
  } else if (state.pop <= 0) {
    clearInterval(timerInterval);
    triggerEnd("DESTITUTION IMMÉDIATE !", "Votre popularité est tombée à 0%. L'Assemblée nationale vous a destitué !");
  } else if (state.tension >= 100) {
    clearInterval(timerInterval);
    triggerEnd("RÉVOLUTION SOCIALE !", "Tension à 100% ! La rue a renversé le gouvernement !");
  }
}

function triggerEnd(status, msg) {
  document.getElementById('end-status').innerText = status;
  document.getElementById('end-message').innerText = msg;
  document.getElementById('end-metrics').innerHTML = `
    <p style="margin-top:10px;">Dette finale : <strong>${state.dette} Mds €</strong></p>
    <p>Compte Suisse : <strong>${state.cagnotte} Millions €</strong></p>
    <p>Indice de Soupçon : <strong>${state.soupcon}%</strong></p>
    <p>Mandat tenu : <strong>${state.mois} mois</strong></p>
  `;
  document.getElementById('end-overlay').classList.remove('hidden');
}