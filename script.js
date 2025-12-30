// --- PERSONAGGIO ---
const personaggio = {
  nome: "Escanor",
  attacchiBase: 2
};

// --- ARMI ---
const armi = {
  spada: {
    nome: "Spada",
    bonusColpire: [10, 5, 10, 5],
    bonusDanni: 1
  },
  arco: {
    nome: "Arco",
    bonusColpire: [14, 9, 14, 9],
    bonusDanni: 1
  }
};

// --- INCANTESIMI ---
const incantesimi = {
  musicabardica: { colpire: 2, danni: 2 },
  haste: { colpire: 3, danni: 1, extraAttacco: 2 },
  goodhope: { colpire: 2, danni: 2 }
};

// --- NEMICO ---
function caricaNemico() {
  const salvato = localStorage.getItem("nemico");
  return salvato ? JSON.parse(salvato) : { ca: null };
}

// --- ATTACCHI ---
function calcolaNumeroAttacchi() {
  let totale = personaggio.attacchiBase;
  if (document.getElementById("haste")?.checked) {
    totale += incantesimi.haste.extraAttacco;
  }
  return totale;
}

function bonusColpirePerAttacco(arma, numeroAttacco) {
  const lista = armi[arma].bonusColpire;
  return lista[numeroAttacco - 1] ?? lista[lista.length - 1];
}

// --- GENERA INPUT DADI ---
function generaCampiDadi() {
  const container = document.getElementById("dadiContainer");
  container.innerHTML = "";

  const numeroAttacchi = calcolaNumeroAttacchi();

  for (let i = 1; i <= numeroAttacchi; i++) {
    const div = document.createElement("div");
    div.className = "attacco-card attacco-arco";

    div.innerHTML = `
      <h4>Attacco ${i}</h4>

      <label>Arma:
        <select id="arma${i}">
          <option value="arco" selected>Arco</option>
          <option value="spada">Spada</option>
        </select>
      </label>

      <label>Dado colpire:
        <input type="number" id="dadoColpire${i}" inputmode="numeric" placeholder="0">
      </label>

      <label>Dado danni:
        <input type="number" id="dadoDanni${i}" inputmode="numeric" placeholder="0">
      </label>
    `;

    container.appendChild(div);
  }
}

// --- CALCOLO TURNO ---
function calcolaTurno() {
  const nemico = caricaNemico();
  const numeroAttacchi = calcolaNumeroAttacchi();

  let output = "";
  let totaleDanni = 0;

  for (let i = 1; i <= numeroAttacchi; i++) {
    const arma = document.getElementById(`arma${i}`).value;

    const dadoColpire = parseInt(document.getElementById(`dadoColpire${i}`).value) || 0;
    const dadoDanni = parseInt(document.getElementById(`dadoDanni${i}`).value) || 0;

    let bonusColpire = bonusColpirePerAttacco(arma, i);
    let bonusDanni = armi[arma].bonusDanni;

    for (let key in incantesimi) {
      if (document.getElementById(key)?.checked) {
        bonusColpire += incantesimi[key].colpire || 0;
        bonusDanni += incantesimi[key].danni || 0;
      }
    }

    const totaleColpire = dadoColpire + bonusColpire;
    const totaleDanniAttacco = dadoDanni + bonusDanni;

    let colpito = false;
    let esito = "❓ CA sconosciuta";
    let classe = `attacco-card attacco-${arma}`;

    if (nemico.ca !== null) {
      if (totaleColpire >= nemico.ca) {
        colpito = true;
        esito = "✅ COLPITO";
        totaleDanni += totaleDanniAttacco;
      } else {
        esito = "❌ MANCATO";
        classe += " attacco-mancato";
      }
    }

    output += `
      <div class="${classe}">
        <strong>Attacco ${i} (${armi[arma].nome})</strong><br>
        Colpire: ${totaleColpire}<br>
        Danni: ${colpito ? totaleDanniAttacco : 0}<br>
        ${esito}
      </div>
    `;
  }

  output += `
    <div class="section">
      <h3>🔥 Totale danni inflitti: ${totaleDanni}</h3>
    </div>
  `;

  document.getElementById("riepilogo").innerHTML = output;
}

// --- INIT ---
const containerDadi = document.createElement("div");
containerDadi.id = "dadiContainer";
document.body.insertBefore(containerDadi, document.getElementById("riepilogo"));

generaCampiDadi();

document.getElementById("haste")?.addEventListener("change", generaCampiDadi);
