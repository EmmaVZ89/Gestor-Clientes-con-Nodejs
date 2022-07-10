const URL = "http://localhost:2022/";

$("#btn-iniciar").on("click", (e) => {
  e.preventDefault();
  let nombreUsuario = $("#nombreUsuario").val();
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
        localStorage.setItem("jwt", obj_ret.jwt);
        swal("!Usuario Valido!", "Redirigiendo...", "success");
        setTimeout(() => {
          $(location).attr("href", URL);
        }, 2000);
      } else {
        swal("!Usuario Inválido!", obj_ret.mensaje, "error");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      let respuesta = JSON.parse(jqXHR.responseText);
      swal("!Usuario Inválido!", respuesta.mensaje, "error");
    });
});
