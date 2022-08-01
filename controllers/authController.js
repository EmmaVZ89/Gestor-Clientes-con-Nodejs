const { createJWT, isTokenValid } = require("../utils/jwt");

const loginUser = async (req, res) => {
  const user = res.obj_usuario;
  const payload = {
    usuario: {
      nombre: user.nombre,
      apellido: user.apellido,
      perfil: user.perfil,
    },
    administrador: {
      nombre: "Soledad",
      apellido: "Quiroz",
    },
    app: "Gestor de Clientes",
  };

  const token = createJWT(payload);
  response.json({
    exito: true,
    mensaje: "JWT creado!!!",
    jwt: token,
  });
};

