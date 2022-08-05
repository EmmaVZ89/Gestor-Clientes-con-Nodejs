window.addEventListener("load", function () {
  verificarSesionIniciada();
  manejadorIniciarSesion();
});

const URL = "http://localhost:2022/";
const animateX = document.querySelectorAll(".animated-scroll-right");
animateX[0].style.opacity = 1;
animateX[0].classList.add("view-from-right");

const manejadorIniciarSesion = () => {
  const btnIniciar = document.querySelector("#btn-iniciar");
  btnIniciar.addEventListener("click", iniciarSesion);
};

const iniciarSesion = async (e) => {
  e.preventDefault();
  const nombreUsuario = $("#nombreUsuario").val().trim().toLowerCase();
  const clave = $("#clave").val();
  const usuario = {};
  usuario.nombreUsuario = nombreUsuario;
  usuario.clave = clave;

  if (validarCampos(nombreUsuario, clave)) {
    try {
      const { data } = await axios.post(URL + "login", usuario);
      if (data.exito) {
        localStorage.setItem("jwt", data.jwt);
        swal("¡ Sesión Iniciada !", "Redirigiendo...", "success");
        setTimeout(() => {
          $(location).attr("href", URL + "inicio");
        }, 2000);
      }
    } catch (error) {
      swal("¡ Inicio Fallido !", error.response.data.mensaje, "error");
    }
  } else {
    swal("¡ Campos vacios !", "Debe completar ambos campos", "error");
  }
};

const verificarSesionIniciada = async () => {
  const jwt = localStorage.getItem("jwt");
  if(jwt !== null) {
    const headers = { headers: { Authorization: "Bearer " + jwt } };
    try {
      const { data } = await axios.get(URL + "login", headers);
      if(data.exito) {
        swal("¡ Sesión Iniciada !", "Redirigiendo...", "success");
        setTimeout(() => {
          $(location).attr("href", URL + "inicio");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }  
  }
};

const validarCampos = (nombre, clave) => {
  let retorno = true;
  if (nombre.trim() === "" || clave.trim() === "") {
    retorno = false;
  }
  return retorno;
};
