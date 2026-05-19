let schedaModificata = false;

function segnaSchedaModificata() {
  if (!schedaModificata) {
    schedaModificata = true;
    document.getElementById("btnSalva").classList.add("visible");
  }
}

function caricaScheda() {
  const mostri = JSON.parse(localStorage.getItem("mostri")) || {};
  const id = localStorage.getItem("mostroAttivo");

  // Se esiste un mostro attivo, lo carico
  if (id && mostri[id]) {
    return mostri[id];
  }

  // Altrimenti scheda vuota (nuovo mostro)
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

function caricamostri() {
  return JSON.parse(localStorage.getItem("mostri")) || {};
}

function salvamostri(mostri) {
  localStorage.setItem("mostri", JSON.stringify(mostri));
}

function setmostroAttivo(id) {
  localStorage.setItem("mostroAttivo", id);
}

function getmostroAttivo() {
  return localStorage.getItem("mostroAttivo");
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

  const nomeM = document.getElementById("nomeMInput").value;
  scheda.nomeM = nomeM;

  const allineamento = document.getElementById("allineamento").value;
  scheda.allineamento = allineamento;

  const taglia = document.getElementById("taglia").value;
  scheda.taglia = taglia;

  const GS = document.getElementById("GS").value;
  scheda.GS = GS;

  const CA = document.getElementById("CA").value;
  scheda.CA = CA;

  const PF = document.getElementById("PF").value;
  scheda.PF = PF;

  const velocita = document.getElementById("velocita").value;
  scheda.velocita = velocita;

  const categoria = document.getElementById("categoria").value;
  scheda.categoria = categoria;

  const skill = document.getElementById("skill").value;
  scheda.skill = skill;

  const azioni = document.getElementById("azioni").value;
  scheda.azioni = azioni


  // 🔹 MULTI PERSONAGGIO
  const mostri = caricamostri();
  let id = getmostroAttivo();

  // Se è un nuovo mostro
  if (!id) {
    id = "pg_" + Date.now();
    setmostroAttivo(id);
  }

  mostri[id] = scheda;
  salvamostri(mostri);
  
  alert("Scheda salvata");
  
  schedaModificata = false;
  document.getElementById("btnSalva").classList.remove("visible");
}

function eliminaMostro() {

  const id = getmostroAttivo();

  if (!id) {
    alert("Nessun mostro da eliminare");
    return;
  }

  const conferma = confirm(
    "Vuoi davvero eliminare questo mostro?"
  );

  if (!conferma) return;

  const mostri = caricamostri();

  delete mostri[id];

  salvamostri(mostri);

  localStorage.removeItem("mostroAttivo");

  window.location.href = "mostri.html";
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
    "nomeMInput",
    "nomeM",
    "allineamento",
    "taglia",
    "categoria",
    "GS",
    "CA",
    "PF",
    "velocita",
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

  setValue("CA", scheda.CA);
  setValue("PF", scheda.PF);
  setValue("velocita", scheda.velocita);

  // Caratteristiche
  setValue("forzScheda", scheda.forz);
  setValue("desScheda",  scheda.des);
  setValue("cosScheda",  scheda.cos);
  setValue("intScheda",  scheda.int);
  setValue("sagScheda",  scheda.sag);
  setValue("carScheda",  scheda.car);

  // Anagrafica
  setValue("nomeMInput", scheda.nomeM);
  setValue("allineamento", scheda.allineamento);
  setValue("taglia", scheda.taglia);
  setValue("categoria", scheda.categoria);
  setValue("GS", scheda.GS);
  setValue("tipoCreatura", scheda.tipoCreatura);
  setValue("skill", scheda.skill);
  setValue("organizzazione", scheda.organizzazione);

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

  const btnElimina = document.getElementById("btnEliminaMostro");

  if (btnElimina) {
    btnElimina.addEventListener("click", eliminaMostro);
  }
});

document.addEventListener("DOMContentLoaded", () => {

  const btnElimina = document.getElementById("btnEliminaMostro");

  if (!getmostroAttivo()) {
    btnElimina.style.display = "none";
  }

});

function autoResizeTextarea(textarea) {

  textarea.style.height = "auto";

  textarea.style.height =
    textarea.scrollHeight + "px";
}

document.addEventListener("DOMContentLoaded", () => {

  const campi =
    document.querySelectorAll("input, select, textarea");

  campi.forEach(campo => {

    campo.addEventListener(
      "change",
      segnaSchedaModificata
    );

    campo.addEventListener(
      "input",
      segnaSchedaModificata
    );

  });

  const textareas =
    document.querySelectorAll(".auto-expand");

  textareas.forEach(textarea => {

    autoResizeTextarea(textarea);

    textarea.addEventListener("input", () => {
      autoResizeTextarea(textarea);
    });

  });

});