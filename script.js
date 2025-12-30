// ================= PERSONAGGIO =================
const personaggio = {
  nome: "Escanor",
  attacchiBase: 2
};

// ================= ARMI =================
const armi = {
  spada: {
    nome: "Spada",
    bonusColpire: [10, 5, 10, 5],
    bonusDanni: 1,
    critico: { range: [19, 20], moltiplicatore: 2 }
  },
  arco: {
    nome: "Arco",
    bonusColpire: [14, 9, 14, 9],
    bonusDanni: 1,
    critico: { range: [20], moltiplicatore: 3 }
  }
};

// ================= TALENTI =================
const talenti = {
  rapidshot: { nome: "Rapid Shot", colpire: -2, extraAttacco: 1 },
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

// ================= INCANTESIMI =================
const incantesimi = {
  musicabardica: { colpire: 2, danni: 2 },
  haste: { colpire: 3, danni: 1, extraAttacco: 2 },
  goodhope: { colpire: 2, danni: 2 }
};

// ================= NEMICO =================
function caricaNemico() {
  const salvato = localStorage.getItem("nemico");
  return salvato ? JSON.parse(salvato) : { ca: null };
}

// ================= NUMERO ATTACCHI =================
function calcolaNumeroAttacchi() {
  let totale = personaggio.attacchiBase;
  
  if (document.getElementById("haste")?.checked) totale += incantesimi.haste.extraAttacco;
  if (document.getElementById("rapidshot")?.checked) totale += talenti.rapidshot.extraAttacco;
  return totale;
}

// ================= BONUS COLPIRE =================
function bonusColpirePerAttacco(arma, indice) {
  const lista = armi[arma].bonusColpire;
  return lista[indice - 1] ?? lista[lista.length - 1];
}

// ================= GENERA CAMPI =================
function generaCampiDadi() {
  const container = document.getElementById("dadiContainer");
  container.innerHTML = "";

  const manyShotAttivo = document.getElementById("manyshot")?.checked;
  const attacchi = calcolaNumeroAttacchi();

  for (let i = 1; i <= attacchi; i++) {
    const div = document.createElement("div");
    div.className = "attacco-card";

    let secondDadoDanni = "";
    if (i === 1 && manyShotAttivo) {
      secondDadoDanni = `<label>Dado danni Many Shot: <input type="number" id="dadoDanniManyShot${i}" value="0"></label>`;
    }

    div.innerHTML = `
      <h4>Attacco ${i}</h4>

      <label>Arma:
        <select id="arma${i}">
          <option value="arco">Arco</option>
          <option value="spada">Spada</option>
        </select>
      </label>

      <label>Dado colpire:
        <input type="number" id="dadoColpire${i}" inputmode="numeric" placeholder="">
      </label>

      <label>Dado danni:
        <input type="number" id="dadoDanni${i}" inputmode="numeric" placeholder="">
      </label>
      ${secondDadoDanni}
    `;

    container.appendChild(div);
  }
}

// ================= CALCOLO TURNO =================
function calcolaTurno() {
  const nemico = caricaNemico();
  const attacchi = calcolaNumeroAttacchi();

  let output = "";
  let totaleDanni = 0;

  for (let i = 1; i <= attacchi; i++) {
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

    for (let key in talenti) {
      if (document.getElementById(key)?.checked) {
        bonusColpire += talenti[key].colpire || 0;
        bonusDanni += talenti[key].danni || 0;
      }
    }

    const totaleColpire = dadoColpire + bonusColpire;
    let danni = dadoDanni + bonusDanni;

    // ===== CRITICO =====
    let critico = false;
    const criticoData = armi[arma].critico;

    if (criticoData.range.includes(dadoColpire)) {
      critico = true;
      danni *= criticoData.moltiplicatore;
    }

    let colpito = false;
    let esito = "❓ CA sconosciuta";

    if (nemico.ca !== null) {
      if (totaleColpire >= nemico.ca) {
        colpito = true;
        esito = "✅ COLPITO";
        totaleDanni += danni;

        // ===== MANY SHOT =====
        if (
          i === 1 &&
          document.getElementById("manyshot")?.checked &&
          document.getElementById(`dadoDanniManyShot${i}`)
        ) {
          const dadoMany = parseInt(
            document.getElementById(`dadoDanniManyShot${i}`).value
          ) || 0;

          let danniManyShot = dadoMany + bonusDanni;

          // critico NON si applica a many shot (Pathfinder rule)
          totaleDanni += danniManyShot;

          output += `
            <div class="attacco-card manyshot">
              🎯 Many Shot: danni aggiuntivi = ${danniManyShot}
            </div>
          `;
        }
      } else {
        esito = "❌ MANCATO";
      }
    }

    let classe = `attacco-card attacco-${arma}`;
    if (critico) classe += " critico";

    output += `
      <div class="${classe}">
        <strong>Attacco ${i} (${armi[arma].nome})</strong><br>
        Colpire: ${totaleColpire}<br>
        Danni: ${colpito ? danni : 0}<br>
        ${critico ? "💥 CRITICO!" : ""}
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

// ================= INIT =================
const container = document.createElement("div");
container.id = "dadiContainer";
document.body.insertBefore(container, document.getElementById("riepilogo"));

generaCampiDadi();
document.getElementById("haste")?.addEventListener("change", generaCampiDadi);
document.getElementById("rapidshot")?.addEventListener("change", generaCampiDadi);
document.getElementById("manyshot")?.addEventListener("change", generaCampiDadi);
