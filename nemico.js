function caricaNemico() {
  const salvato = localStorage.getItem("nemico");
  return salvato
    ? JSON.parse(salvato)
    : {
        ca: null,
        resistenze: [],
        immunita: [],
        vulnerabilita: [],
        tipo: []
      };
}

function salvaNemico() {
  const nemico = caricaNemico();

  const ca = document.getElementById("caNemico").value;
  nemico.ca = ca ? parseInt(ca) : null;

  nemico.tipo = [...document.querySelectorAll("h2 + label input:checked")]
    .filter(el => el.closest("h2").innerText === "Tipo di Creatura")
    .map(el => el.value);

  nemico.resistenze = [...document.querySelectorAll("h2 + label input:checked")]
    .filter(el => el.closest("h2").innerText === "Resistenze")
    .map(el => el.value);

  nemico.immunita = [...document.querySelectorAll("h2 + label input:checked")]
    .filter(el => el.closest("h2").innerText === "Immunità")
    .map(el => el.value);

  localStorage.setItem("nemico", JSON.stringify(nemico));

  window.location.href = "index.html";
}

function ripristinaUI() {
  const nemico = caricaNemico();

  if (nemico.ca !== null) {
    document.getElementById("caNemico").value = nemico.ca;
  }

  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.checked =
      nemico.tipo.includes(cb.value) ||
      nemico.resistenze.includes(cb.value) ||
      nemico.immunita.includes(cb.value);
  });
}

ripristinaUI();