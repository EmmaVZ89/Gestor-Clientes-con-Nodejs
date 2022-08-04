const agregarControl = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo agregar el control",
    status: 418,
  };

  let jwt = res.jwt;

  let control_json = {};
  control_json.id = req.body.id;
  control_json.fecha = req.body.fecha;
  control_json.peso = req.body.peso;
  control_json.pecho = req.body.pecho;
  control_json.cintura = req.body.cintura;
  control_json.ombligo = req.body.ombligo;
  control_json.cadera = req.body.cadera;
  control_json.biceps = req.body.biceps;
  control_json.muslos = req.body.muslos;
  control_json.objetivo = req.body.objetivo;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("INSERT INTO controles set ?", [control_json], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Control agregado!";
        obj_respuesta.status = 200;
        res.status(obj_respuesta.status).json(obj_respuesta);
      });
    });
  }
};

const listarControles = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se encontraron controles",
    dato: {},
    status: 424,
  };

  let jwt = res.jwt;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("SELECT * FROM controles", (err, rows) => {
        if (err) throw "Error en consulta de base de datos.";
        if (rows.length == 0) {
          res.status(obj_respuesta.status).json(obj_respuesta);
        } else {
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "Controles encontrados!";
          obj_respuesta.dato = rows;
          obj_respuesta.status = 200;
          res.status(obj_respuesta.status).json(rows);
        }
      });
    });
  }
};

const modificarControl = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo modificar el control",
    status: 418,
  };

  let jwt = res.jwt;

  let control_json = {};
  control_json.id = req.body.id;
  control_json.fecha = req.body.fecha;
  control_json.peso = req.body.peso;
  control_json.pecho = req.body.pecho;
  control_json.cintura = req.body.cintura;
  control_json.ombligo = req.body.ombligo;
  control_json.cadera = req.body.cadera;
  control_json.biceps = req.body.biceps;
  control_json.muslos = req.body.muslos;
  control_json.objetivo = req.body.objetivo;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query(
        "UPDATE controles SET ? WHERE id = ? AND fecha = ?",
        [control_json.id, control_json.fecha],
        (err, rows) => {
          if (err) {
            console.log(err);
            throw "Error en consulta de base de datos.";
          }
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "Control modificado!";
          obj_respuesta.status = 200;
          res.status(obj_respuesta.status).json(obj_respuesta);
        }
      );
    });
  }
};

const eliminarControl = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo eliminar el control",
    status: 418,
  };

  let jwt = res.jwt;

  let control_json = {};
  control_json.id = req.body.id;
  control_json.fecha = req.body.fecha;
  control_json.peso = req.body.peso;
  control_json.pecho = req.body.pecho;
  control_json.cintura = req.body.cintura;
  control_json.ombligo = req.body.ombligo;
  control_json.cadera = req.body.cadera;
  control_json.biceps = req.body.biceps;
  control_json.muslos = req.body.muslos;
  control_json.objetivo = req.body.objetivo;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query(
        "DELETE FROM controles WHERE id = ? AND fecha = ?",
        [control_json.id, control_json.fecha],
        (err, rows) => {
          if (err) {
            console.log(err);
            throw "Error en consulta de base de datos.";
          }
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "Control eliminado!";
          obj_respuesta.status = 200;
          res.status(obj_respuesta.status).json(obj_respuesta);
        }
      );
    });
  }
};

module.exports = { listarControles, agregarControl, modificarControl, eliminarControl };
