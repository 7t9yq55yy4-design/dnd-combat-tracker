document.addEventListener("DOMContentLoaded", () => {

  const pagina = window.location.pathname;

  const btnHome = document.getElementById("btnHome");
  const btnCombattimento = document.getElementById("btnCombattimento");
  const btnNemico = document.getElementById("btnNemico");
  const btnSalva = document.getElementById("btnSalva");

  // Navigazione
  if (btnHome) {
    btnHome.onclick = () => window.location.href = "index.html";
  }

  if (btnCombattimento) {
    btnCombattimento.onclick = () => window.location.href = "combattimento.html";
  }

  if (btnNemico) {
    btnNemico.onclick = () => window.location.href = "nemico.html";
  }

  // Stato attivo
  if (pagina.includes("index")) btnHome?.classList.add("active");
  if (pagina.includes("combattimento")) btnCombattimento?.classList.add("active");
  if (pagina.includes("nemico")) btnNemico?.classList.add("active");

  // Salva visibile SOLO su scheda.html
  if (pagina.includes("scheda")) {
    btnSalva?.addEventListener("click", salvaScheda);
  } else {
    btnSalva?.classList.add("hidden");
  }

});
