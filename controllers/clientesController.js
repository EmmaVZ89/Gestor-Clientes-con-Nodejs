const agregarCliente = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo agregar el cliente",
    status: 418,
  };

  let jwt = res.jwt;

  let cliente_json = {};
  cliente_json.id = req.body.id;
  cliente_json.nombre = req.body.nombre;
  cliente_json.dni = req.body.dni;
  cliente_json.edad = req.body.edad;
  cliente_json.altura = req.body.altura;
  cliente_json.telefono = req.body.telefono;
  cliente_json.facebook = req.body.facebook;
  cliente_json.instagram = req.body.instagram;
  cliente_json.direccion = req.body.direccion;
  cliente_json.id_control = req.body.id;
  cliente_json.estado = req.body.estado;

  let control = req.body.control[0];
  control.id = cliente_json.id;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("INSERT INTO clientes set ?", [cliente_json], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
      });
    });

    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("INSERT INTO controles set ?", [control], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Cliente agregado!";
        obj_respuesta.status = 200;
        res.status(obj_respuesta.status).json(obj_respuesta);
      });
    });
  }
};

const listarClientes = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se encontraron clientes",
    dato: {},
    payload: null,
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
      conn.query("SELECT * FROM clientes", (err, rows) => {
        if (err) throw "Error en consulta de base de datos.";
        if (rows.length == 0) {
          res.status(obj_respuesta.status).json(obj_respuesta);
        } else {
          obj_respuesta.exito = true;
          obj_respuesta.mensaje = "Clientes encontrados!";
          obj_respuesta.dato = rows;
          obj_respuesta.payload = jwt;
          obj_respuesta.status = 200;
          res.status(obj_respuesta.status).json(obj_respuesta);
        }
      });
    });
  }
};

const traerCliente = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo encontrar el cliente",
    dato: [],
    status: 418,
  };

  const jwt = res.jwt;
  const { id: idCliente } = req.params;
  let cliente = {};
  cliente.control = [];

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    return res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("SELECT * FROM clientes WHERE id = ?", [idCliente], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
        cliente = rows[0];
      });
    });

    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("SELECT * FROM controles WHERE id = ?", [idCliente], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
        if (cliente !== undefined) {
          cliente.control = [...rows];
        }
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Cliente Eliminado!";
        obj_respuesta.dato = cliente;
        obj_respuesta.status = 200;
        res.status(obj_respuesta.status).json(obj_respuesta);
      });
    });
  }
};

const modificarCliente = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo modificar el cliente",
    status: 418,
  };

  let jwt = res.jwt;

  let cliente_json = {};
  cliente_json.id = req.body.id;
  cliente_json.nombre = req.body.nombre;
  cliente_json.dni = req.body.dni;
  cliente_json.edad = req.body.edad;
  cliente_json.altura = req.body.altura;
  cliente_json.telefono = req.body.telefono;
  cliente_json.facebook = req.body.facebook;
  cliente_json.instagram = req.body.instagram;
  cliente_json.direccion = req.body.direccion;
  cliente_json.id_control = req.body.id;
  cliente_json.estado = req.body.estado;

  let control = req.body.control;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    control.forEach((c) => {
      req.getConnection((err, conn) => {
        if (err) throw "Error al conectarse a la base de datos.";
        conn.query("UPDATE controles SET ? WHERE id = ? AND fecha = ?", [c, c.id, c.fecha], (err, rows) => {
          if (err) {
            console.log(err);
            throw "Error en consulta de base de datos.";
          }
        });
      });
    });

    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("UPDATE clientes SET ? WHERE id = ?", [cliente_json, cliente_json.id], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Cliente Modificado!";
        obj_respuesta.status = 200;
        res.status(obj_respuesta.status).json(obj_respuesta);
      });
    });
  }
};

const eliminarCliente = async (req, res) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo eliminar el cliente",
    status: 418,
  };

  let jwt = res.jwt;

  let cliente_json = {};
  cliente_json.id = req.body.id;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    res.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("DELETE FROM clientes WHERE id = ?", [cliente_json.id], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
      });
    });

    req.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("DELETE FROM controles WHERE id = ?", [cliente_json.id], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Cliente Eliminado!";
        obj_respuesta.status = 200;
        res.status(obj_respuesta.status).json(obj_respuesta);
      });
    });
  }
};

module.exports = { listarClientes, traerCliente, agregarCliente, modificarCliente, eliminarCliente };
