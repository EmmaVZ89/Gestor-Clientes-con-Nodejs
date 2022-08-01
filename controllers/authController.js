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
  res.json({
    exito: true,
    mensaje: "JWT creado!!!",
    jwt: token,
  });
};

const checkLogin = async (req, res) => {
  const obj_respuesta = {
    exito: false,
    mensaje: "El JWT es requerido!!!",
    payload: null,
    status: 403,
  };

  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(obj_respuesta.status).json({
      obj_respuesta,
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (token !== "null") {
    const isVerifiedToken = isTokenValid(token);
    if (!isVerifiedToken) {
      obj_respuesta.mensaje = "El JWT NO es válido!!!";
      return res.status(obj_respuesta.status).json(obj_respuesta);
    }
    obj_respuesta.exito = true;
    obj_respuesta.mensaje = "El JWT es valido";
    obj_respuesta.payload = isVerifiedToken;
    obj_respuesta.status = 200;
    return res.status(obj_respuesta.status).json(obj_respuesta);
  }
  res.status(obj_respuesta.status).json({ obj_respuesta });
};

module.exports = {
  loginUser,
  checkLogin,
};
