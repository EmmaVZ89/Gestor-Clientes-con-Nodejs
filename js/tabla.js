import { Cliente } from "./cliente.js";

export default function createTable(array) {
  array.sort(function(a, b) {
    return a.nombre.localeCompare(b.nombre);
  })
  array.sort(function(a, b) {
    if(a.estado == 0 && b.estado == 1) {
      return 1;
    }
    if(a.estado == 1 && b.estado == 0) {
      return -1;
    }
    return 0;
  })
  const $table = document.createElement("table");
  $table.appendChild(createThead());
  $table.appendChild(createTbody(array));

  $table.classList.add(
    "table",
    "table-bordered",
  );
  return $table;
}

function createThead() {
  const obj = new Cliente();
  const $thead = document.createElement("thead");
  const $tr = document.createElement("tr");
  $tr.classList.add("th-table");
  $tr.setAttribute("id", "th-table");
  for (const key in obj) {
    if (
      key === "id" ||
      key === "nombre" ||
      key === "telefono"
    ) {
      const $th = document.createElement("th");
      const $text = document.createTextNode(key.toUpperCase());
      $th.appendChild($text);
      $tr.appendChild($th);
    }
  }
  let $th = document.createElement("th");
  let $accion = document.createTextNode("ACTIVAR / DESACTIVAR");
  $th.appendChild($accion);
  $tr.appendChild($th);
  $thead.appendChild($tr);
  return $thead;
}

function createTbody(array) {
  const $tbody = document.createElement("tbody");
  array.forEach((element) => {
    const $tr = document.createElement("tr");
    $tr.classList.add("tr-table");
    
    if(! element.estado) {
      $tr.style.opacity = "0.5";
    }
    for (const key in element) {
      if (key === "id") {
        $tr.setAttribute("data-id", element[key]);
      }
      if (
        key === "id" ||
        key === "nombre" ||
        key === "telefono"
      ) {
        const $td = document.createElement("td");
        const $text = document.createTextNode(element[key]);
        $td.appendChild($text);
        $tr.appendChild($td);
      }
    }
    let $td = document.createElement("td");
    $td.innerHTML = `<button data-id="${element.id}" id='btnActivarDesactivar'> Activar / Desactivar </button>`;
    $tr.appendChild($td);
    $tbody.appendChild($tr);
  });
  return $tbody;
}
