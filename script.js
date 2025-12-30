// --- PERSONAGGIO ---
const personaggio = { nome: "Escanor", attacchiBase: 2 };

// --- ARMI ---
const armi = {
  spada: { nome: "Spada", bonusColpire: [10, 5, 10, 5, 10, 5], bonusDanni: 1 },
  arco: { nome: "Arco", bonusColpire: [14, 9, 14, 9, 14, 9], bonusDanni: 1 }
};

// --- INCANTESIMI ---
const incantesimi = {
  musicabardica: { colpire: 2, danni: 2 },
  haste: { colpire: 3, danni: 1, extraAttacco: 2 },
  goodhope: { colpire: 2, danni: 2 }
};

// --- TALENTI ---
const talenti = {
  rapidshot: { nome: "Rapid Shot", colpire: -2, extraAttacco: 2 },
  pointblank: { nome: "Point Blank", colpire: 1 },
  manyshot: { nome: "Many Shot", attacco1DoppioDanno: true },
  deadlyaim: {
    nome: "Deadly Aim",
    colpire: -2,
    danni: 4,
    bonusNemico: {
      drago: { colpire: 4, danni: 4 },
      nano: { colpire: 2, danni: 2 }
    }
  }
};

// --- FUNZIONI UTILI ---

function caricaNemico() {
  const salvato = localStorage.getItem("nemico");
  return salvato ? JSON.parse(salvato) : { ca: null };
}

function calcolaNumeroAttacchi() {
  let totale = personaggio.attacchiBase;
  if (document.getElementById("haste")?.checked) totale += incantesimi.haste.extraAttacco;
  if (document.getElementById("rapidshot")?.checked) totale += talenti.rapidshot.extraAttacco;
  return totale;
}

function bonusColpirePerAttacco(armaSelezionata, numeroAttacco) {
  const bonusList = armi[armaSelezionata].bonusColpire;
  if (numeroAttacco <= bonusList.length) return bonusList[numeroAttacco - 1];
  return bonusList[bonusList.length - 1];
}

// --- GENERA CAMPI DADI E ARMA ---
function generaCampiDadi() {
  const numeroAttacchi = calcolaNumeroAttacchi();
  const container = document.getElementById("dadiContainer");
  container.innerHTML = "";

  const manyShotAttivo = document.getElementById("manyshot")?.checked;

  for (let i = 1; i <= numeroAttacchi; i++) {
    const div = document.createElement("div");
    div.className = "attacco-card";

    // Many Shot: secondo dado danni solo se attivo sul primo attacco
    let secondDadoDanni = "";
    if (i === 1 && manyShotAttivo) {
      secondDadoDanni = `
        <label>Dado danni Many Shot: 
          <input type="number" id="dadoDanniManyShot${i}" inputmode="numeric" pattern="[0-9]*" value="" placeholder="0">
        </label>`;
    }

    div.innerHTML = `
      <h4>Attacco ${i}</h4>
      <label>Arma:
        <select id="arma${i}">
          <option value="spada">Spada</option>
          <option value="arco" selected>Arco</option>
        </select>
      </label>
      <label>Dado colpire: 
        <input type="number" id="dadoColpire${i}" inputmode="numeric" pattern="[0-9]*" value="" placeholder="0">
      </label>
      <label>Dado danni: 
        <input type="number" id="dadoDanni${i}" inputmode="numeric" pattern="[0-9]*" value="" placeholder="0">
      </label>
      ${secondDadoDanni}
    `;
    container.appendChild(div);
  }
}

// --- CALCOLO DEL TURNO ---
function calcolaTurno() {
  const nemico = caricaNemico();
  const numeroAttacchi = calcolaNumeroAttacchi();

  let risultato = "";
  let totaleDanni = 0;

  for (let i = 1; i <= numeroAttacchi; i++) {

    const dadoColpire = parseInt(document.getElementById(`dadoColpire${i}`).value) || 0;
    const dadoDanni = parseInt(document.getElementById(`dadoDanni${i}`).value) || 0;

    let bonusColpire = bonusColpirePerAttacco(i);
    let bonusDanni = armi[armaAttiva].bonusDanni;

    // incantesimi
    for (let key in incantesimi) {
      if (document.getElementById(key)?.checked) {
        bonusColpire += incantesimi[key].colpire || 0;
        bonusDanni += incantesimi[key].danni || 0;
      }
    }

    const totaleColpire = dadoColpire + bonusColpire;
    let totaleDanniAttacco = dadoDanni + bonusDanni;

    let esito = "❓ CA sconosciuta";
    let classe = "attacco-card";

    let colpito = false;

    if (nemico.ca !== null) {
      if (totaleColpire >= nemico.ca) {
        esito = "✅ COLPITO";
        colpito = true;
        classe += " attacco-colpito";
        totaleDanni += totaleDanniAttacco;
      } else {
        esito = "❌ MANCATO";
        classe += " attacco-mancato";
      }
    }

    risultato += `
      <div class="${classe}">
        <strong>Attacco ${i}</strong><br>
        Colpire: ${totaleColpire} <br>
        Danni: ${colpito ? totaleDanniAttacco : 0} <br>
        ${esito}
      </div>
    `;
  }

  risultato += `
    <div class="section">
      <h3>🔥 Totale danni inflitti: ${totaleDanni}</h3>
    </div>
  `;

  document.getElementById("riepilogo").innerHTML = risultato;
}

    // --- GESTIONE CRITICO ---
    let criticoMoltiplicatore = 1;
    if (armaSelezionata === "arco" && dadoColpire === 20) criticoMoltiplicatore = 3;
    if (armaSelezionata === "spada" && (dadoColpire === 19 || dadoColpire === 20)) criticoMoltiplicatore = 2;
    totaleDanniAttacco *= criticoMoltiplicatore;

    // --- CARD COLORE ---
    let cardClasse = armaSelezionata === "arco" ? "attacco-card attacco-arco" : "attacco-card attacco-spada";
    let criticoClasse = criticoMoltiplicatore > 1 ? "critico" : "";

    risultato += `<div class="${cardClasse} ${criticoClasse}">
      <strong>Attacco ${i} (${armi[armaSelezionata].nome})</strong><br>
      Totale colpire = ${totaleColpire}<br>
      Totale danni = ${totaleDanniAttacco}
    </div>`;

    totaleDanniGlobale += totaleDanniAttacco;

    // Many Shot
    if (i === 1 && document.getElementById("manyshot")?.checked) {
      const dadoMany = parseInt(document.getElementById(`dadoDanniManyShot${i}`)?.value) || 0;
      let totaleMany = dadoMany + bonusDanni;
      risultato += `<div class="attacco-card manyshot">
        Many Shot: danno aggiuntivo = ${totaleMany}
      </div>`;
      totaleDanniGlobale += totaleMany;
    }
  }

  risultato += `<div class="section"><strong>Totale danni globali: ${totaleDanniGlobale}</strong></div>`;
  document.getElementById("riepilogo").innerHTML = risultato;
}

// --- INIT ---
const containerDadi = document.createElement("div");
containerDadi.id = "dadiContainer";
document.body.insertBefore(containerDadi, document.getElementById("riepilogo"));
generaCampiDadi();

// Aggiorna i campi quando cambiano Haste, Rapid Shot o Many Shot
document.getElementById("haste")?.addEventListener("change", generaCampiDadi);
document.getElementById("rapidshot")?.addEventListener("change", generaCampiDadi);
document.getElementById("manyshot")?.addEventListener("change", generaCampiDadi);
