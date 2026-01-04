let schedaModificata = false;

function segnaSchedaModificata() {
  if (!schedaModificata) {
    schedaModificata = true;
    document.getElementById("btnSalva").classList.add("visible");
  }
}

function caricaScheda() {
  const personaggi = JSON.parse(localStorage.getItem("personaggi")) || {};
  const id = localStorage.getItem("personaggioAttivo");

  // Se esiste un personaggio attivo, lo carico
  if (id && personaggi[id]) {
    return personaggi[id];
  }

  // Altrimenti scheda vuota (nuovo personaggio)
  return {
    forz: null,
    des: null,
    cos: null,
    int: null,
    sag: null,
    car: null,

    nomeG: "",
    nomeP: "",
    bg: "",
    allineamento: "",
    specie: "",
    taglia: "",
    xp: "",

    classe: "",
    specializzazione: "",
    classIcon: "",

    livello: "",
  };
}

function caricaPersonaggi() {
  return JSON.parse(localStorage.getItem("personaggi")) || {};
}

function salvaPersonaggi(personaggi) {
  localStorage.setItem("personaggi", JSON.stringify(personaggi));
}

function setPersonaggioAttivo(id) {
  localStorage.setItem("personaggioAttivo", id);
}

function getPersonaggioAttivo() {
  return localStorage.getItem("personaggioAttivo");
}

function salvaScheda() {
  const scheda = caricaScheda();

  const forz = document.getElementById("forzScheda").value;
  scheda.forz = forz ? parseInt(forz) : null;

  const des = document.getElementById("desScheda").value;
  scheda.des = des ? parseInt(des) : null;

  const cos = document.getElementById("cosScheda").value;
  scheda.cos = cos ? parseInt(cos) : null;

  const int = document.getElementById("intScheda").value;
  scheda.int = int ? parseInt(int) : null;

  const sag = document.getElementById("sagScheda").value;
  scheda.sag = sag ? parseInt(sag) : null;

  const car = document.getElementById("carScheda").value;
  scheda.car = car ? parseInt(car) : null;

  const nomeG = document.getElementById("nomeGInput").value;
  scheda.nomeG = nomeG;

  const nomeP = document.getElementById("nomeP").value;
  scheda.nomeP = nomeP;

  const bg = document.getElementById("bg").value;
  scheda.bg = bg;

  const allineamento = document.getElementById("allineamento").value;
  scheda.allineamento = allineamento;

  const specie = document.getElementById("specie").value;
  scheda.specie = specie;

  const taglia = document.getElementById("taglia").value;
  scheda.taglia = taglia;

  const xp = document.getElementById("xp").value;
  scheda.xp = xp;

  const classIcon = document.getElementById("classIcon");
  scheda.classIcon = document.getElementById("classIcon").style.backgroundImage;

  const classe = document.getElementById("classe").value;
  scheda.classe = classe;

  const specializzazione = document.getElementById("specializzazione").value;
  scheda.specializzazione = specializzazione;

  const livello = document.getElementById("livello").value;
  scheda.livello = livello;


  // 🔹 MULTI PERSONAGGIO
  const personaggi = caricaPersonaggi();
  let id = getPersonaggioAttivo();

  // Se è un nuovo personaggio
  if (!id) {
    id = "pg_" + Date.now();
    setPersonaggioAttivo(id);
  }

  personaggi[id] = scheda;
  salvaPersonaggi(personaggi);
  
  alert("Scheda salvata");
  
  schedaModificata = false;
  document.getElementById("btnSalva").classList.remove("visible");
}

function resetScheda() {
  // Messaggio di conferma
  const conferma = confirm("Sei sicuro di voler cancellare tutti i dati?");
  if (!conferma) return; // Se premi NO, non succede nulla

  // Campi principali della scheda
  const campi = [
    "forzScheda",
    "desScheda",
    "cosScheda",
    "intScheda",
    "sagScheda",
    "carScheda",
    "nomeGInput",
    "nomeP",
    "bg",
    "allineamento",
    "specie",
    "taglia",
    "xp",
    "livello",
  ];

  // Ciclo e svuoto tutti i campi
  campi.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // Aggiorna i modificatori a 0
  const mods = ["modFor","modDes","modCos","modInt","modSag","modCar"];
  mods.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "+0";
  });

  // Rimuove scheda dal localStorage
  localStorage.removeItem("scheda");

  alert("Scheda azzerata!");
}

function calcolaMod(valore) {
  return Math.floor((valore - 10) / 2);
}

const stats = [
  ["forzScheda", "modFor"],
  ["desScheda", "modDes"],
  ["cosScheda", "modCos"],
  ["intScheda", "modInt"],
  ["sagScheda", "modSag"],
  ["carScheda", "modCar"]
];

stats.forEach(([inputId, modId]) => {
  const input = document.getElementById(inputId);
  const mod = document.getElementById(modId);

  input.addEventListener("input", () => {
    const valore = parseInt(input.value) || 0;
    const modificatore = calcolaMod(valore);
    mod.textContent = modificatore >= 0 ? `+${modificatore}` : modificatore;
  });
});

function ripristinaScheda() {
  const scheda = caricaScheda();
  if (!scheda) return;

  const setValue = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== null && value !== "") {
      el.value = value;
    }
  };

  // Caratteristiche
  setValue("forzScheda", scheda.forz);
  setValue("desScheda",  scheda.des);
  setValue("cosScheda",  scheda.cos);
  setValue("intScheda",  scheda.int);
  setValue("sagScheda",  scheda.sag);
  setValue("carScheda",  scheda.car);

  // Anagrafica
  setValue("nomeGInput", scheda.nomeG);
  setValue("nomeP", scheda.nomeP);
  setValue("bg", scheda.bg);
  setValue("allineamento", scheda.allineamento);
  setValue("specie", scheda.specie);
  setValue("taglia", scheda.taglia);
  setValue("xp", scheda.xp);
  setValue("livello", scheda.livello);


  // Classe e specializzazione
  if (scheda.classe) {
    const classeSelect = document.getElementById("classe");
    const specSelect = document.getElementById("specializzazione");

    if (classeSelect) classeSelect.value = scheda.classe;

    const classSpecializzazioni = {
      "Barbaro": ["Berserker", "Totemico", "Furia del Clan"],
      "Bardo": ["Valoroso", "Lore", "Maestro delle Spade"],
      "Chierico": ["Dominio Vita", "Dominio Guerra", "Dominio Conoscenza"],
      "Druido": ["Cerchio della Luna", "Cerchio della Terra", "Cerchio della Vita"]
    };

    if (specSelect && classSpecializzazioni[scheda.classe]) {
      specSelect.innerHTML = '<option value="">-- Specializzazione --</option>';

      classSpecializzazioni[scheda.classe].forEach(spec => {
        const option = document.createElement("option");
        option.value = spec;
        option.textContent = spec;
        specSelect.appendChild(option);
      });

      if (scheda.specializzazione) {
        specSelect.value = scheda.specializzazione;
      }
    }
  }

  // Icona classe
  if (scheda.classIcon) {
    const icon = document.getElementById("classIcon");
    if (icon) {
      icon.style.backgroundImage = scheda.classIcon;
      icon.style.backgroundSize = "contain";
      icon.style.backgroundRepeat = "no-repeat";
      icon.style.backgroundPosition = "center";
    }
  }
}

function aggiornaMod(inputId, modId) {
  const input = document.getElementById(inputId);
  const mod = document.getElementById(modId);
  const valore = parseInt(input.value) || 0;
  const m = Math.floor((valore - 10) / 2);
  mod.textContent = m >= 0 ? `+${m}` : m;
}

document.addEventListener("DOMContentLoaded", () => {
  ripristinaScheda();

  aggiornaMod("forzScheda", "modFor");
  aggiornaMod("desScheda", "modDes");
  aggiornaMod("cosScheda", "modCos");
  aggiornaMod("intScheda", "modInt");
  aggiornaMod("sagScheda", "modSag");
  aggiornaMod("carScheda", "modCar");
});

// Ogni classe ha un array di specializzazioni
const classSpecializzazioni = {
  "Barbaro": ["Berserker", "Totemico"],
  "Bardo": ["Valoroso", "Lore", "Maestro delle Spade"],
  "Chierico": ["Dominio Vita", "Dominio Guerra", "Dominio Conoscenza"],
  "Druido": ["Cerchio della Luna", "Cerchio della Terra", "Cerchio della Vita"]
};

// Quando cambia la classe
const classeSelect = document.getElementById("classe");
const specSelect = document.getElementById("specializzazione");
const classIcon = document.getElementById("classIcon");

classeSelect.addEventListener("change", () => {
  const classe = classeSelect.value;

  // Pulisco le specializzazioni
  specSelect.innerHTML = '<option value="">-- Specializzazione --</option>';

  if (classe && classSpecializzazioni[classe]) {
    classSpecializzazioni[classe].forEach(spec => {
      const option = document.createElement("option");
      option.value = spec;
      option.textContent = spec;
      specSelect.appendChild(option);
    });
  }

  // Aggiorna icona
  if (classe) {
    classIcon.style.backgroundImage = `url('classe_icona/${classe.toLowerCase()}.png')`;
    classIcon.style.backgroundSize = "contain";
    classIcon.style.backgroundRepeat = "no-repeat";
    classIcon.style.backgroundPosition = "center";
  } else {
    classIcon.style.backgroundImage = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const campi = document.querySelectorAll("input, select, textarea");

  campi.forEach(campo => {
    campo.addEventListener("change", segnaSchedaModificata);
    campo.addEventListener("input", segnaSchedaModificata);
  });
});
