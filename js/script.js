import { Cliente, Control } from "./cliente.js";
import createTable from "./tabla.js";
import { updateControlList, activateControlFields, desactivateControlFields } from "./listaControles.js";

const URL = "http://localhost:2022/";

const $divSpinner = document.getElementById("spinner");

let listaClientes =  await getClientes();
const $divTable = document.querySelector(".contenedorTabla");
updateTable();

// setTimeout(() => {
//   console.log(listaClientes);
//   updateTable();
// }, 3000);

const actualDate = new Date();
const date = document.querySelector("#txtFecha");
date.value = actualDate.toJSON().slice(0, 10);

const $formularioCRUD = document.forms[0];
const $formularioControl = document.forms[1];

let controles = [];
const $ulControl = document.querySelector("#listaControles");
const $btnControlCancel = document.querySelector("#btn-controles-cancel");
const $btnControlProgreso = document.querySelector("#btn-controles-progreso");

let cliente;
const $btnForm = document.querySelector("#btn-form");
const $btnFormCancel = document.querySelector("#btn-form-cancel");
const $btnCrear = document.querySelector("#btn-crear");
const $btnModificar = document.querySelector("#btn-modificar");
const $btnDelete = document.querySelector("#btn-eliminar");
const $btnFicha = document.querySelector("#btn-ficha");
$btnModificar.disabled = true;
$btnDelete.disabled = true;
$btnFicha.disabled = true;

// EVENTOS BOTONES -----------------------------------------------------------------------------------
$btnCrear.addEventListener("click", () => {
  resetForm();
  if (!$btnForm.classList.contains("btn-primary")) {
    $btnForm.classList.add("btn-primary");
  }
  $("#miModal").modal("show");
});

$btnModificar.addEventListener("click", () => {
  $btnForm.innerText = "Modificar";
  $btnForm.classList.remove("btn-primary");
  $btnForm.classList.add("btn-success");
  $("#miModal").modal("show");
});

$btnDelete.addEventListener("click", () => {
  $btnForm.innerText = "Eliminar";
  $btnForm.classList.remove("btn-primary");
  $btnForm.classList.add("btn-danger");
  $("#miModal").modal("show");
});

$btnFormCancel.addEventListener("click", () => {
  resetForm();
  $("#miModal").modal("hide");
});

$btnFicha.addEventListener("click", () => {
  resetFormControls();
  if ($btnControlProgreso.classList.contains("btn-dark")) {
    $btnControlProgreso.classList.replace("btn-dark", "btn-info");
  }
  document.querySelector("#dropdownMenuButton1").disabled = false;
  document.querySelector("#btn-controles-modificar").disabled = true;
  document.querySelector("#btn-controles-eliminar").disabled = true;
  $("#modalControles").modal("show");
});

$btnControlProgreso.addEventListener("click", () => {
  resetFormControls();
  if (document.querySelector("#dropdownMenuButton1").disabled === false) {
    const { fecha, peso, pecho, cintura, ombligo, cadera, biceps, muslo, objetivo } = $formularioControl;
    document.querySelector("#dropdownMenuButton1").disabled = true;
    document.querySelector("#btn-controles-agregar").disabled = true;

    fecha.value = actualDate.toJSON().slice(0, 10);
    peso.value = (cliente.control[cliente.control.length - 1].peso - cliente.control[0].peso).toFixed(3);
    pecho.value = (cliente.control[cliente.control.length - 1].pecho - cliente.control[0].pecho).toFixed(2);
    cintura.value = (
      cliente.control[cliente.control.length - 1].cintura - cliente.control[0].cintura
    ).toFixed(2);
    ombligo.value = (
      cliente.control[cliente.control.length - 1].ombligo - cliente.control[0].ombligo
    ).toFixed(2);
    cadera.value = (cliente.control[cliente.control.length - 1].cadera - cliente.control[0].cadera).toFixed(
      2
    );
    biceps.value = (cliente.control[cliente.control.length - 1].biceps - cliente.control[0].biceps).toFixed(
      2
    );
    muslo.value = (cliente.control[cliente.control.length - 1].muslos - cliente.control[0].muslos).toFixed(2);
    objetivo.value = (
      cliente.control[cliente.control.length - 1].objetivo - cliente.control[0].objetivo
    ).toFixed(2);

    $btnControlProgreso.textContent = "Dejar de ver";
    $btnControlProgreso.classList.toggle("btn-info");
    $btnControlProgreso.classList.toggle("btn-dark");
    changeColors();
    desactivateControlFields();
  } else {
    document.querySelector("#dropdownMenuButton1").disabled = false;
    $btnControlProgreso.textContent = "Ver Progreso";
    $btnControlProgreso.classList.toggle("btn-info");
    $btnControlProgreso.classList.toggle("btn-dark");
    resetColors();
    resetFormControls();
  }
});

$btnControlCancel.addEventListener("click", () => {
  $("#modalControles").modal("hide");
});
// EVENTOS BOTONES -----------------------------------------------------------------------------------

// EVENTOS PANTALLA Y FORMULARIOS --------------------------------------------------------------------
window.addEventListener("click", (e) => {
  if (e.target.matches("td")) {
    let respuesta = confirm("¿ Desea Activar o Desactivar el cliente ?");
    if(respuesta == false) {
      $btnModificar.disabled = false;
      $btnDelete.disabled = false;
      $btnFicha.disabled = false;
      let id = e.target.parentElement.dataset.id;
      cliente = listaClientes.find((c) => c.id.toString() === id);
      controles = cliente.control;
      uploadFormCRUD(cliente);
      uploadFormControl(cliente);  
    } else {
      let id = e.target.parentElement.dataset.id;
      cliente = listaClientes.find((c) => c.id.toString() === id);
      if(cliente.estado) {
        cliente.estado = false;
      } else {
        cliente.estado = true;
      }
      updateCliente(cliente);
    }
  }
});

$formularioCRUD.addEventListener("submit", (e) => {
  e.preventDefault();
  const {
    numeroCliente,
    nombre,
    dni,
    edad,
    altura,
    telefono,
    facebook,
    instagram,
    direccion,
    fecha,
    peso,
    pecho,
    cintura,
    ombligo,
    cadera,
    biceps,
    muslo,
    objetivo,
  } = $formularioCRUD;

  const control = new Control(
    fecha.value,
    peso.value,
    pecho.value,
    cintura.value,
    ombligo.value,
    cadera.value,
    biceps.value,
    muslo.value,
    objetivo.value
  );

  if ($btnForm.innerHTML !== "Eliminar") {
    if ($btnForm.innerHTML === "Guardar") {
      controles = [];
    }
    if (!controles.length) {
      controles.push(control);
    } else {
      controles.shift();
      controles.unshift(control);
    }
  }

  const cliente = new Cliente(
    numeroCliente.value,
    nombre.value,
    dni.value,
    edad.value,
    altura.value,
    telefono.value,
    facebook.value,
    instagram.value,
    direccion.value,
    controles
  );

  // if (!lookForClient(listaClientes, numeroCliente.value) && $btnForm.innerHTML === "Guardar") {
    if ($btnForm.innerHTML === "Guardar") {
    cliente.estado = true;
    createCliente(cliente);
  } else if ($btnForm.innerHTML === "Modificar") {
    updateCliente(cliente);
  } else {
    deleteCliente(parseInt($formularioCRUD.numeroCliente.value));
  }
  $("#miModal").modal("hide");
  controles = [];
});

$formularioControl.addEventListener("submit", (e) => {
  e.preventDefault();
  const { fecha, peso, pecho, cintura, ombligo, cadera, biceps, muslo, objetivo } = $formularioControl;

  const control = new Control(
    fecha.value,
    peso.value,
    pecho.value,
    cintura.value,
    ombligo.value,
    cadera.value,
    biceps.value,
    muslo.value,
    objetivo.value
  );

  let idSubmitter = e.submitter.id;
  let index = cliente.control.findIndex((c) => c.fecha === fecha.value);

  if (idSubmitter === "btn-controles-agregar") {
    cliente.control.push(control);
    updateCliente(cliente);
    resetFormControls();
  } else if (idSubmitter === "btn-controles-modificar") {
    if (index !== -1) {
      cliente.control[index] = control;
      updateCliente(cliente);
      resetFormControls();
    }
  } else if (idSubmitter === "btn-controles-eliminar") {
    if (index !== -1) {
      cliente.control.splice(index, 1);
      updateCliente(cliente);
      resetFormControls();
    }
  }
});

$ulControl.addEventListener("click", (e) => {
  const date = e.target.dataset.date;
  const control = cliente.control.find((c) => c.fecha === date);
  document.querySelector("#btn-controles-agregar").disabled = true;
  document.querySelector("#btn-controles-modificar").disabled = false;
  document.querySelector("#btn-controles-eliminar").disabled = false;
  uploadControl(control);
});
// EVENTOS PANTALLA Y FORMULARIOS --------------------------------------------------------------------

// CRUD CLIENTE **************************************************************************************

async function getClientes() {
  $divSpinner.appendChild(getSpinner());
  try {
    const { data } = await axios.get(URL+"listarClientes");
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    clearDivSpinner();
  }
}
 
async function getCliente(id) {
  try {
    const { data } = await axios(URL + "/" + id);
    console.log("GET: ", data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function createCliente(nuevoCliente) {
  try {
    const { data } = await axios.post(URL+"agregarCliente", nuevoCliente);
    updateTable(listaClientes);
    resetForm();
    console.log("CREATE: ", data);
  } catch (error) {
    console.error(error);
  }
}

async function updateCliente(clienteToEdit) {
  try {
    resetForm();
    const { data } = await axios.put(URL + "/" + clienteToEdit.id, clienteToEdit);
    updateTable(listaClientes);
    console.log("UPDATE: ", data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteCliente(id) {
  try {
    resetForm();
    const { data } = await axios.delete(URL + "/" + id);
    updateTable(listaClientes);
    console.log("DELETE: ", data);
  } catch (error) {
    console.error(error);
  }
}

// CRUD CLIENTE **************************************************************************************

// FUNCIONES PARA CARGA Y RESETEO DE FORMULARIOS -----------------------------------------------------

async function updateTable() {
  while ($divTable.hasChildNodes()) {
    $divTable.removeChild($divTable.firstChild);
  }
  const data = await getClientes();
  if (data) {
    listaClientes = null;
    listaClientes = [...data];
    $divTable.appendChild(createTable(listaClientes));
  }
}

function resetForm() {
  $formularioCRUD.reset();
  $btnCrear.disabled = false;
  $btnModificar.disabled = true;
  $btnDelete.disabled = true;
  $btnFicha.disabled = true;
  $btnForm.innerText = "Guardar";
  $btnForm.classList.remove("btn-success");
  $btnForm.classList.remove("btn-danger");
  date.value = actualDate.toJSON().slice(0, 10);
}

function uploadFormCRUD(cliente) {
  const {
    numeroCliente,
    nombre,
    dni,
    edad,
    altura,
    telefono,
    facebook,
    instagram,
    direccion,
    fecha,
    peso,
    pecho,
    cintura,
    ombligo,
    cadera,
    biceps,
    muslo,
    objetivo,
  } = $formularioCRUD;

  numeroCliente.value = cliente.id;
  nombre.value = cliente.nombre;
  dni.value = cliente.dni;
  edad.value = cliente.edad;
  altura.value = cliente.altura;
  telefono.value = cliente.telefono;
  facebook.value = cliente.facebook;
  instagram.value = cliente.instagram;
  direccion.value = cliente.direccion;
  if (cliente.control !== undefined) {
    fecha.value = cliente.control[0].fecha;
    peso.value = cliente.control[0].peso;
    pecho.value = cliente.control[0].pecho;
    cintura.value = cliente.control[0].cintura;
    ombligo.value = cliente.control[0].ombligo;
    cadera.value = cliente.control[0].cadera;
    biceps.value = cliente.control[0].biceps;
    muslo.value = cliente.control[0].muslos;
    objetivo.value = cliente.control[0].objetivo;
  }
}

function resetFormControls() {
  $formularioControl.reset();
  uploadFormControl(cliente);
  updateControlList(cliente);
  document.querySelector("#btn-controles-agregar").disabled = false;
  document.querySelector("#btn-controles-modificar").disabled = true;
  document.querySelector("#btn-controles-eliminar").disabled = true;
  $btnControlProgreso.textContent = "Ver Progreso";
  activateControlFields();
  resetColors();
}
function uploadFormControl(cliente) {
  const { numeroCliente, nombre, fecha } = $formularioControl;

  numeroCliente.value = cliente.id;
  nombre.value = cliente.nombre;
  fecha.value = actualDate.toJSON().slice(0, 10);
}

function uploadControl(control) {
  const { fecha, peso, pecho, cintura, ombligo, cadera, biceps, muslo, objetivo } = $formularioControl;

  fecha.value = control.fecha;
  peso.value = control.peso;
  pecho.value = control.pecho;
  cintura.value = control.cintura;
  ombligo.value = control.ombligo;
  cadera.value = control.cadera;
  biceps.value = control.biceps;
  muslo.value = control.muslos;
  objetivo.value = control.objetivo;
}

function lookForClient(clientes, id) {
  return clientes.some((el) => el.id === id);
}

function changeColors() {
  const inputs = document.querySelectorAll("#form-controls input");
  inputs.forEach((input) => {
    if (input.name !== "numeroCliente" && input.name !== "nombre" && input.name !== "fecha") {
      if (input.value < 0) {
        input.setAttribute("style", "color: green; text-align: center; font-weight: bold");
      } else {
        input.setAttribute("style", "color: red; text-align: center; font-weight: bold");
      }
    }
  });
}

function resetColors() {
  const inputs = document.querySelectorAll("#form-controls input");
  inputs.forEach((i) => {
    i.removeAttribute("style");
  });
}
// FUNCIONES PARA CARGA Y RESETEO DE FORMULARIOS -----------------------------------------------------

function getSpinner() {
  const spinner = document.createElement("img");
  spinner.setAttribute("src", "./assets/spinner.gif");
  spinner.setAttribute("alt", "loader");
  spinner.style.marginLeft = "43%";
  spinner.style.width = "10rem";
  return spinner;
}

function clearDivSpinner() {
  while ($divSpinner.hasChildNodes()) {
    $divSpinner.removeChild($divSpinner.firstChild);
  }
}

export { updateTable, resetForm };
