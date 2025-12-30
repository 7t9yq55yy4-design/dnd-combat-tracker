function caricaNemico() {
  const salvato = localStorage.getItem("nemico");

  return salvato
    ? JSON.parse(salvato)
    : {
        ca: null,
        tipo: [],
        resistenze: [],
        immunita: [],
        vulnerabilita: []
      };
}

function salvaNemico() {
  const nemico = caricaNemico();

  const ca = document.getElementById("caNemico").value;
  nemico.ca = ca ? parseInt(ca) : null;

  nemico.tipo = [...document.querySelectorAll(".tipo:checked")].map(cb => cb.value);
  nemico.resistenze = [...document.querySelectorAll(".resistenza:checked")].map(cb => cb.value);
  nemico.immunita = [...document.querySelectorAll(".immunita:checked")].map(cb => cb.value);

  localStorage.setItem("nemico", JSON.stringify(nemico));

  window.location.href = "index.html";
  alert("Nemico salvato");
}

function ripristinaUI() {
  const nemico = caricaNemico();

  if (nemico.ca !== null) {
    document.getElementById("caNemico").value = nemico.ca;
  }

  document.querySelectorAll(".tipo").forEach(cb => cb.checked = nemico.tipo.includes(cb.value));
  document.querySelectorAll(".resistenza").forEach(cb => cb.checked = nemico.resistenze.includes(cb.value));
  document.querySelectorAll(".immunita").forEach(cb => cb.checked = nemico.immunita.includes(cb.value));
}

ripristinaUI();
