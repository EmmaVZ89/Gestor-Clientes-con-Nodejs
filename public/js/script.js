import { Cliente, Control } from "./cliente.js";
import createTable from "./tabla.js";
import {
  updateControlList,
  activateControlFields,
  desactivateControlFields,
  dateFormat,
} from "./listaControles.js";

const URL = "http://localhost:2022/";

VerificarJWT();

const $divSpinner = document.getElementById("spinner");

let listaClientes = await getClientes();
let listaControles = await getControles();

const $divTable = document.querySelector(".contenedorTabla");
updateTable();

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
const $tituloCrud = document.querySelector("#modalTitle");
const $btnForm = document.querySelector("#btn-form");
const $btnFormCancel = document.querySelector("#btn-form-cancel");
const $btnCrear = document.querySelector("#btn-crear");
const $btnModificar = document.querySelector("#btn-modificar");
const $btnDelete = document.querySelector("#btn-eliminar");
const $btnFicha = document.querySelector("#btn-ficha");
$btnModificar.disabled = true;
$btnDelete.disabled = true;
$btnFicha.disabled = true;

// Logout
const $btnLogOut = document.querySelector("#btn-logout");
$btnLogOut.addEventListener("click", () => {
  logOut();
});

// Filtro de clientes activos e inactivos
const $linkClientesActivos = document.querySelector("#clientes-activos");
const $linkClientesInactivos = document.querySelector("#clientes-inactivos");
const $linkClientesTodos = document.querySelector("#clientes-todos");

// Btn mensaje
const $btnCopiarMensaje = document.querySelector("#btn-copiar-progreso");
const $contenedorMensaje = document.querySelector("#txtMensaje");
$btnCopiarMensaje.addEventListener("click", () => {
  let content = document.getElementById("txtMensaje");
  content.select();
  document.execCommand("copy");
  swal("¡ Copiado !", `El mensaje fue copiado.`, "success");
});

// EVENTOS LINKS -----------------------------------------------------------------------------------
$linkClientesActivos.addEventListener("click", () => {
  let listaActivos = listaClientes.filter((c) => c.estado === 1);
  updateTableFiltered(listaActivos);
});

$linkClientesInactivos.addEventListener("click", () => {
  let listaInactivos = listaClientes.filter((c) => c.estado === 0);
  updateTableFiltered(listaInactivos);
});

$linkClientesTodos.addEventListener("click", () => {
  updateTable();
});

// EVENTOS BOTONES -----------------------------------------------------------------------------------
$btnCrear.addEventListener("click", () => {
  resetForm();
  enableInputs();
  if (!$btnForm.classList.contains("btn-primary")) {
    $btnForm.classList.add("btn-primary");
  }
  $tituloCrud.innerText = "Alta de Cliente";
  $("#miModal").modal("show");
});

$btnModificar.addEventListener("click", () => {
  enableInputs();
  const { numeroCliente } = $formularioCRUD;
  numeroCliente.disabled = true;
  $btnForm.innerText = "Modificar";
  $btnForm.classList.remove("btn-primary");
  $btnForm.classList.add("btn-success");
  $tituloCrud.innerText = "Modificación de Cliente";
  $("#miModal").modal("show");
});

$btnDelete.addEventListener("click", () => {
  disableInputsCrud();
  $btnForm.innerText = "Eliminar";
  $btnForm.classList.remove("btn-primary");
  $btnForm.classList.add("btn-danger");
  $tituloCrud.innerText = "Baja de Cliente";
  $("#miModal").modal("show");
});

$btnFormCancel.addEventListener("click", () => {
  resetForm();
  $("#miModal").modal("hide");
});

$btnFicha.addEventListener("click", () => {
  resetFormControls();
  // const {objetivo} = $formularioControl;
  // objetivo.disabled = true;
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
    const { fecha, peso, pecho, cintura, ombligo, cadera, biceps, muslo, objetivo, nombre } =
      $formularioControl;
    document.querySelector("#dropdownMenuButton1").disabled = true;
    document.querySelector("#btn-controles-agregar").disabled = true;

    let diferenciaPeso = (cliente.control[cliente.control.length - 1].peso - cliente.control[0].peso).toFixed(
      3
    );
    let diferenciaPecho = (
      cliente.control[cliente.control.length - 1].pecho - cliente.control[0].pecho
    ).toFixed(2);
    let diferenciaCintura = (
      cliente.control[cliente.control.length - 1].cintura - cliente.control[0].cintura
    ).toFixed(2);
    let diferenciaOmbligo = (
      cliente.control[cliente.control.length - 1].ombligo - cliente.control[0].ombligo
    ).toFixed(2);
    let diferenciaCadera = (
      cliente.control[cliente.control.length - 1].cadera - cliente.control[0].cadera
    ).toFixed(2);
    let diferenciaBiceps = (
      cliente.control[cliente.control.length - 1].biceps - cliente.control[0].biceps
    ).toFixed(2);
    let diferenciaMuslo = (
      cliente.control[cliente.control.length - 1].muslos - cliente.control[0].muslos
    ).toFixed(2);
    fecha.value = actualDate.toJSON().slice(0, 10);
    peso.value = diferenciaPeso;
    pecho.value = diferenciaPecho;
    cintura.value = diferenciaCintura;
    ombligo.value = diferenciaOmbligo;
    cadera.value = diferenciaCadera;
    biceps.value = diferenciaBiceps;
    muslo.value = diferenciaMuslo;
    objetivo.value = (
      cliente.control[cliente.control.length - 1].objetivo - cliente.control[0].objetivo
    ).toFixed(2);

    let cont = document.querySelector("#contenedorMensajePersonal");
    cont.style.opacity = 1;
    cont.style.display = "flex";
    cont.classList.add("view-from-right");
    $contenedorMensaje.value = `⭐ FELICITACIONES TENEMOS MEGA RESULTADO DE ${nombre.value.toUpperCase()} ⭐

    Bajó  ${Math.abs(
      diferenciaPeso
    )}  Kg y esta super enfocada en lograr su mejor versión !! Super disciplinada en todo y miren los resultados que está teniendo y felicitémosla !!!!
    
    CENTÍMETROS MENOS
    🔴Pecho:  ${Math.abs(diferenciaPecho)} cm
    🔴Cintura:  ${Math.abs(diferenciaCintura)} cm
    🔴Ombligo:  ${Math.abs(diferenciaOmbligo)} cm
    🔴Cadera:  ${Math.abs(diferenciaCadera)} cm
    🔴Bíceps:  ${Math.abs(diferenciaBiceps)} cm
    🔴Muslo:  ${Math.abs(diferenciaMuslo)} cm
    La disciplina es el puente entre las metas y los logros.
    😃💪🏻👏🏻😱🍾🎊🎉🎈🎁`;

    $btnControlProgreso.textContent = "Dejar de ver";
    $btnControlProgreso.classList.toggle("btn-info");
    $btnControlProgreso.classList.toggle("btn-dark");
    changeColors();
    desactivateControlFields();
  } else {
    let cont = document.querySelector("#contenedorMensajePersonal");
    cont.style.opacity = 0;
    cont.style.display = "none";
    cont.classList.remove("view-from-right");
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
let flagDesactivar = false;
window.addEventListener("click", (e) => {
  if (e.target.matches("td")) {
    flagDesactivar = false;
    $btnModificar.disabled = false;
    $btnDelete.disabled = false;
    $btnFicha.disabled = false;
    let id = e.target.parentElement.dataset.id;
    cliente = listaClientes.find((c) => c.id.toString() === id);
    controles = listaControles.filter((control) => {
      return control.id == cliente.id;
    });
    cliente.control = controles;
    uploadFormCRUD(cliente);
    uploadFormControl(cliente);
    swal("! Ficha cargada !", `Se cargo a ${cliente.nombre} con exito`, "success");
  }

  if (e.target.matches("button")) {
    let id = e.target.dataset.id;
    let index = listaClientes.findIndex((c) => c.id == id);
    if (index != -1) {
      activarDesactivarCliente(id);
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
    numeroCliente.value,
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

  const clienteCRUD = new Cliente(
    numeroCliente.value,
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

  if (!lookForClient(listaClientes, numeroCliente.value) && $btnForm.innerHTML === "Guardar") {
    clienteCRUD.estado = 1;
    listaControles.push(control);
    createCliente(clienteCRUD);
    swal("¡ Agregado !", `El cliente fue agregado`, "success");
  } else if ($btnForm.innerHTML === "Modificar") {
    swal({
      title: `¿Desea modificar a ${cliente.nombre}?`,
      text: `Una vez modificado NO es posible recuperar la información.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (!flagDesactivar) {
          clienteCRUD.estado = 1;
        }
        let index = listaClientes.findIndex((c) => c.id == clienteCRUD.id);
        let indexControl = listaControles.findIndex(
          (c) => c.id == clienteCRUD.id && c.fecha == clienteCRUD.control[0].fecha
        );
        listaControles[indexControl] = clienteCRUD.control[0];
        listaClientes[index] = clienteCRUD;
        updateCliente(clienteCRUD);
        swal("¡ Modificado !", `El cliente fue modificado`, "success");
      } else {
        swal("No se realizó ninguna modificación!");
      }
    });
  } else {
    swal({
      title: `¿Desea eliminar a ${cliente.nombre}?`,
      text: `Una vez eliminado NO es posible recuperar la información.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteCliente(parseInt($formularioCRUD.numeroCliente.value));
        swal("¡ Eliminado !", `El cliente fue eliminado`, "success");
      } else {
        swal("No se eliminó ningún cliente!");
      }
    });
  }
  $("#miModal").modal("hide");
  controles = [];
});

$formularioControl.addEventListener("submit", (e) => {
  e.preventDefault();
  const { fecha, peso, pecho, cintura, ombligo, cadera, biceps, muslo, objetivo } = $formularioControl;

  const control = new Control(
    cliente.id,
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
    let controlExist = listaControles.findIndex((c) => c.id == cliente.id && c.fecha == control.fecha);
    if (controlExist !== -1) {
      swal(
        "¡ Ya existe el control !",
        "Verifica que la fecha sea distinta a un control ya existente.",
        "error"
      );
    } else {
      cliente.control.push(control);
      listaControles.push(control);
      createControl(control);
      resetFormControls();
      swal("¡ Agregado !", "El control fue agregado", "success");
    }
  } else if (idSubmitter === "btn-controles-modificar") {
    if (index !== -1) {
      swal({
        title: `¿Seguro que quiere modificar el control del ${dateFormat(
          new Date(cliente.control[index].fecha + "T00:00:00")
        )}?`,
        text: "Una vez modificado no es posible recuperar la información.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          let indexControl = listaControles.findIndex((c) => c.id == control.id && c.fecha == control.fecha);
          listaControles[indexControl] = control;
          cliente.control[index] = control;
          updateCliente(cliente);
          resetFormControls();
          swal("¡ Modificado !", "El control fue modificado", "success");
        } else {
          swal("El control NO fue modificado!");
        }
      });
    }
  } else if (idSubmitter === "btn-controles-eliminar") {
    if (index !== -1) {
      swal({
        title: `¿Seguro que quiere eliminar el control del ${dateFormat(
          new Date(cliente.control[index].fecha + "T00:00:00")
        )}?`,
        text: "Una vez eliminado no es posible recuperarlo.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          let controlToDelete = cliente.control[index];
          let indexControl = listaControles.findIndex((c) => c.id == control.id && c.fecha == control.fecha);
          cliente.control.splice(index, 1);
          listaControles.splice(indexControl, 1);
          deleteControl(controlToDelete);
          resetFormControls();
          swal("¡ Eliminado !", "El control fue eliminado", "success");
        } else {
          swal("El control NO fue eliminado!");
        }
      });
    }
  }
});

$ulControl.addEventListener("click", (e) => {
  const { fecha } = $formularioControl;
  fecha.disabled = true;
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
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  $divSpinner.appendChild(getSpinner());
  try {
    const { data } = await axios.get(URL + "listarClientes", headers);
    return data.dato;
  } catch (error) {
    console.error(error);
    logOutForced();
  } finally {
    clearDivSpinner();
  }
}

async function createCliente(nuevoCliente) {
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  try {
    const { data } = await axios.post(URL + "agregarCliente", nuevoCliente, headers);
    updateTable(listaClientes);
    resetForm();
  } catch (error) {
    console.error(error);
    logOutForced();
  }
}

async function updateCliente(clienteToEdit) {
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  try {
    resetForm();
    const { data } = await axios.post(URL + "modificarCliente", clienteToEdit, headers);
    updateTable(listaClientes);
    return data;
  } catch (error) {
    console.error(error);
    logOutForced();
  }
}

async function deleteCliente(id) {
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  try {
    resetForm();
    const { data } = await axios.post(URL + "eliminarCliente", { id: id }, headers);
    updateTable(listaClientes);
  } catch (error) {
    console.error(error);
    logOutForced();
  }
}

// CRUD CLIENTE **************************************************************************************

// CRUD CONTROL **************************************************************************************
async function createControl(nuevoControl) {
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  try {
    const { data } = await axios.post(URL + "agregarControl", nuevoControl, headers);
  } catch (error) {
    console.error(error);
    logOutForced();
  }
}

async function getControles() {
  $divSpinner.appendChild(getSpinner());
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  try {
    const { data } = await axios.get(URL + "listarControles", headers);
    return data;
  } catch (error) {
    console.error(error);
    logOutForced();
  } finally {
    clearDivSpinner();
  }
}

async function deleteControl(control) {
  let jwt = localStorage.getItem("jwt");
  let headers = { headers: { Authorization: "Bearer " + jwt } };
  try {
    const { data } = await axios.post(URL + "eliminarControl", control, headers);
  } catch (error) {
    console.error(error);
    logOutForced();
  }
}

// CRUD CONTROL **************************************************************************************

// FUNCIONES PARA CARGA Y RESETEO DE FORMULARIOS -----------------------------------------------------

function updateTableFiltered(lista) {
  while ($divTable.hasChildNodes()) {
    $divTable.removeChild($divTable.firstChild);
  }
  $divTable.appendChild(createTable(lista));
  paginarTabla();
}

async function updateTable() {
  while ($divTable.hasChildNodes()) {
    $divTable.removeChild($divTable.firstChild);
  }
  const data = await getClientes();
  if (data) {
    listaClientes = null;
    listaClientes = [...data];
    $divTable.appendChild(createTable(listaClientes));
    paginarTabla();
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
  let cont = document.querySelector("#contenedorMensajePersonal");
  cont.style.opacity = 0;
  cont.style.display = "none";
  cont.classList.remove("view-from-right");
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

function activarDesactivarCliente(id) {
  cliente = listaClientes.find((c) => c.id.toString() === id);
  let accion = "activar";
  let mensaje = "activado";
  if (cliente.estado) {
    accion = "desactivar";
    mensaje = "desactivado";
  }
  swal({
    title: `¿Desea ${accion} el cliente?`,
    text: `Una vez ${mensaje} es posible recuperarlo.`,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      controles = listaControles.filter((control) => {
        return control.id == cliente.id;
      });
      cliente.control = controles;
      if (cliente.estado) {
        cliente.estado = 0;
      } else {
        cliente.estado = 1;
      }
      updateCliente(cliente);
      swal(`¡ ${mensaje.toUpperCase()} !`, `El cliente fue ${mensaje}`, "success");
    } else {
      swal("No se realizó ningún cambio!");
    }
  });
}

function disableInputsCrud() {
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
  numeroCliente.disabled = true;
  nombre.disabled = true;
  dni.disabled = true;
  edad.disabled = true;
  altura.disabled = true;
  telefono.disabled = true;
  facebook.disabled = true;
  instagram.disabled = true;
  direccion.disabled = true;
  fecha.disabled = true;
  peso.disabled = true;
  pecho.disabled = true;
  cintura.disabled = true;
  ombligo.disabled = true;
  cadera.disabled = true;
  biceps.disabled = true;
  muslo.disabled = true;
  objetivo.disabled = true;
}

function enableInputs() {
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
    peso,
    pecho,
    cintura,
    ombligo,
    cadera,
    biceps,
    muslo,
    objetivo,
  } = $formularioCRUD;
  numeroCliente.disabled = false;
  nombre.disabled = false;
  dni.disabled = false;
  edad.disabled = false;
  altura.disabled = false;
  telefono.disabled = false;
  facebook.disabled = false;
  instagram.disabled = false;
  direccion.disabled = false;
  peso.disabled = false;
  pecho.disabled = false;
  cintura.disabled = false;
  ombligo.disabled = false;
  cadera.disabled = false;
  biceps.disabled = false;
  muslo.disabled = false;
  objetivo.disabled = false;
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

// JWT y login***********************************************************************
function VerificarJWT() {
  var jwt = localStorage.getItem("jwt");
  $.ajax({
    type: "GET",
    url: URL + "login",
    dataType: "json",
    data: {},
    headers: { Authorization: "Bearer " + jwt },
    async: true,
  })
    .done(function (obj_rta) {
      if (obj_rta.exito) {
        const foto = document.querySelector("#foto-usuario");
        const nombre = document.querySelector("#nombre-usuario");
        let nombreUsuario = obj_rta.payload.usuario.nombre;
        if (nombreUsuario === "soledad") {
          foto.setAttribute("src", "./assets/soledad.png");
          nombre.innerText = nombreUsuario[0].toUpperCase() + nombreUsuario.slice(1).toLowerCase();
        }
        swal("¡ Bienvenido !", "Tu sesión esta iniciada", "success");
      } else {
        swal("¡ Inicio Fallido !", "Debes iniciar sesión para continuar", "error");
        setTimeout(() => {
          $(location).attr("href", URL);
        }, 1000);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      var retorno = JSON.parse(jqXHR.responseText);
      if (retorno.exito == false) {
        swal("¡ Inicio Fallido !", "Debes iniciar sesión para continuar", "error");
        setTimeout(() => {
          $(location).attr("href", URL);
        }, 1000);
      }
    });
}

function logOut() {
  localStorage.removeItem("jwt");
  swal("¡ Sesión cerrada !", "Redirigiendo...", "success");
  setTimeout(() => {
    $(location).attr("href", URL);
  }, 2000);
}

function logOutForced() {
  localStorage.removeItem("jwt");
  swal("¡ Inicio Fallido !", "Debes iniciar sesión para continuar", "error");
  setTimeout(() => {
    $(location).attr("href", URL);
  }, 2000);
}

// Paginación
function paginarTabla() {
  $(document).ready(function () {
    $("#tablaClientes").DataTable({
      language: {
        processing: "Tratamiento en curso...",
        search: "Buscar&nbsp;:",
        lengthMenu: "Agrupar de _MENU_ clientes",
        info: "Cliente _START_ al _END_ de _TOTAL_ clientes",
        infoEmpty: "No existen datos.",
        infoFiltered: "(filtrado de _MAX_ elementos en total)",
        infoPostFix: "",
        loadingRecords: "Cargando...",
        zeroRecords: "No se encontraron datos con tu busqueda",
        emptyTable: "No hay datos disponibles en la tabla.",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Ultimo",
        },
        aria: {
          sortAscending: ": active para ordenar la columna en orden ascendente",
          sortDescending: ": active para ordenar la columna en orden descendente",
        },
      },
      // searching: false,
    });
  });
}

export { updateTable, resetForm };
