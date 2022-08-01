// const mysql = require("mysql");
// const myconn = require("express-myconnection");
const bcryptjs = require("bcryptjs"); 

const verificar_usuario = (req, res, next) => {
  let usuario = {};
  usuario.nombre = req.body.nombreUsuario;
  usuario.clave = req.body.clave;

  req.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("SELECT * FROM usuarios WHERE nombre = ?", [usuario.nombre], (err, rows) => {
      if (err) throw "Error en consulta de base de datos.";
      if (rows.length == 1) {
        let comparacion = bcryptjs.compareSync(usuario.clave, rows[0].clave);
        if (comparacion) {
          res.obj_usuario = rows[0];
          next();
        } else {
          res.status(401).json({
            exito: false,
            mensaje: "Usuario y/o Contraseña incorrectos",
            jwt: null,
          });
        }
      } else {
        res.status(401).json({
          exito: false,
          mensaje: "Usuario y/o Contraseña incorrectos",
          jwt: null,
        });
      }
    });
  });
};

module.exports = { verificar_usuario };
