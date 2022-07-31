const URL = "http://localhost:2022/";

VerificarSesionIniciada();

let animateX = document.querySelectorAll(".animated-scroll-right");
animateX[0].style.opacity = 1;
animateX[0].classList.add("view-from-right");

$("#btn-iniciar").on("click", (e) => {
  e.preventDefault();
  let nombreUsuario = $("#nombreUsuario").val().trim().toLowerCase();
  let clave = $("#clave").val();
  let dato = {};
  dato.nombreUsuario = nombreUsuario;
  dato.clave = clave;
  
  $.ajax({
    type: "POST",
    url: URL + "login",
    dataType: "json",
    data: dato,
    async: true,
  })
    .done(function (obj_ret) {
      if (obj_ret.exito) {
        //GUARDO EN EL LOCALSTORAGE
        console.log(obj_ret); 
        localStorage.setItem("jwt", obj_ret.jwt);
        swal("!Sesión Iniciada!", "Redirigiendo...", "success");
        setTimeout(() => {
          $(location).attr("href", URL + "inicio");
        }, 2000);
      } else {
        swal("!Inicio Fallido!", obj_ret.mensaje, "error");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      let respuesta = JSON.parse(jqXHR.responseText);
      swal("!Inicio Fallido!", respuesta.mensaje, "error");
    });
});

function VerificarSesionIniciada() {
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
        swal("!Sesión Iniciada!", "Redirigiendo...", "success");
        setTimeout(() => {
          $(location).attr("href", URL + "inicio");
        }, 1000);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      var retorno = JSON.parse(jqXHR.responseText);
    });
}
