const $ulControl = document.querySelector("#listaControles");

function createControlList(cliente) {
  for (let i = cliente.control.length - 1; i >= 0; i--) {
    const $li = document.createElement("li");
    const $text = document.createTextNode(
      dateFormat(new Date(cliente.control[i].fecha + "T00:00:00"))
    );
    $li.appendChild($text);
    $li.classList.add("dropdown-item", "li-control");
    $li.setAttribute("data-date", cliente.control[i].fecha);
    $ulControl.appendChild($li);
  }
}

function updateControlList(cliente) {
  while ($ulControl.hasChildNodes()) {
    $ulControl.removeChild($ulControl.firstChild);
  }
  createControlList(cliente);
}

function activateControlFields() {
  const inputs = document.querySelectorAll("#form-controls input");
  inputs.forEach((input) => {
    if (input.name !== "numeroCliente" && input.name !== "nombre") {
      input.disabled = false;
    }
  });
}

function desactivateControlFields() {
  const inputs = document.querySelectorAll("#form-controls input");
  inputs.forEach((input) => {
    if (input.name !== "numeroCliente" && input.name !== "nombre") {
      input.disabled = true;
    }
  });
}

function dateFormat(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${day}-${month}-${year}`;
}

export { updateControlList, activateControlFields, desactivateControlFields, dateFormat };
