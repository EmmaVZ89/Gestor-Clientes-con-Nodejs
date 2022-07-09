const express = require("express");

const app = express();

const path = require('path');

app.set("puerto", 2022);
 
app.get('/', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'principal.html'));
});

//AGREGO FILE SYSTEM
const fs = require("fs");

//AGREGO JSON
app.use(express.json());

//AGREGO JWT
const jwt = require("jsonwebtoken");

//SE ESTABLECE LA CLAVE SECRETA PARA EL TOKEN
app.set("key", "cl@ve_secreta");
app.use(express.urlencoded({ extended: false }));

//AGREGO MULTER
const multer = require("multer");

//AGREGO MIME-TYPES
const mime = require("mime-types");

//AGREGO STORAGE
const storage = multer.diskStorage({
  destination: "public/fotos/",
});
const upload = multer({
  storage: storage,
});

//AGREGO CORS (por default aplica a http://localhost)
const cors = require("cors");

//AGREGO MW
app.use(cors());

//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));

//AGREGO MYSQL y EXPRESS-MYCONNECTION
const mysql = require("mysql");
const myconn = require("express-myconnection");
const db_options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "clientes_bd",
};
app.use(myconn(mysql, db_options, "single"));

//##############################################################################################//
//RUTAS Y MIDDLEWATE PARA EL SERVIDOR DE AUTENTICACIÓN DE USUARIO Y JWT
//##############################################################################################//
const verificar_usuario = express.Router();
const verificar_jwt = express.Router();

verificar_usuario.use((request, response, next) => {
  let obj = request.body;
  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query(
      "SELECT * FROM usuarios WHERE correo = ? and clave = ? ",
      [obj.correo, obj.clave],
      (err, rows) => {
        if (err) throw "Error en consulta de base de datos.";
        if (rows.length == 1) {
          response.obj_usuario = rows[0];
          //SE INVOCA AL PRÓXIMO CALLEABLE
          next();
        } else {
          response.status(401).json({
            exito: false,
            mensaje: "Correo y/o Clave incorrectos.",
            jwt: null,
          });
        }
      }
    );
  });
});

app.post("/login", verificar_usuario, (request, response, obj) => {
  //SE RECUPERA EL USUARIO DEL OBJETO DE LA RESPUESTA
  const user = response.obj_usuario;
  //SE CREA EL PAYLOAD CON LOS ATRIBUTOS QUE NECESITAMOS
  const payload = {
    usuario: {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      apellido: user.apellido,
      foto: user.foto,
      perfil: user.perfil,
    },
    administrador: {
      nombre: "Soledad",
      apellido: "Quiroz",
    },
    parcial: "Gestor de Clientes",
  };
  //SE FIRMA EL TOKEN CON EL PAYLOAD Y LA CLAVE SECRETA
  const token = jwt.sign(payload, app.get("key"), {
    expiresIn: "4m",
  });
  response.json({
    exito: true,
    mensaje: "JWT creado!!!",
    jwt: token,
  });
});

verificar_jwt.use((request, response, next) => {
  //SE RECUPERA EL TOKEN DEL ENCABEZADO DE LA PETICIÓN
  let token = request.headers["x-access-token"] || request.headers["authorization"];
  if (!token) {
    response.status(401).send({
      error: "El JWT es requerido!!!",
    });
    return;
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (token) {
    //SE VERIFICA EL TOKEN CON LA CLAVE SECRETA
    jwt.verify(token, app.get("key"), (error, decoded) => {
      if (error) {
        return response.json({
          exito: false,
          mensaje: "El JWT NO es válido!!!",
        });
      } else {
        console.log("middleware verificar_jwt");
        //SE AGREGA EL TOKEN AL OBJETO DE LA RESPUESTA
        response.jwt = decoded;
        //SE INVOCA AL PRÓXIMO CALLEABLE
        next();
      }
    });
  }
});

app.get("/login", (request, response) => {
  // response.json({exito:true, payload: response.jwt});
  let obj_respuesta = {
    exito: false,
    mensaje: "El JWT es requerido!!!",
    payload: null,
    status: 403,
  };
  //SE RECUPERA EL TOKEN DEL ENCABEZADO DE LA PETICIÓN
  let token = request.headers["x-access-token"] || request.headers["authorization"];
  if (!token) {
    response.status(obj_respuesta.status).json({
      obj_respuesta,
    });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (token) {
    //SE VERIFICA EL TOKEN CON LA CLAVE SECRETA
    jwt.verify(token, app.get("key"), (error, decoded) => {
      if (error) {
        obj_respuesta.mensaje = "El JWT NO es válido!!!";
        response.status(obj_respuesta.status).json(obj_respuesta);
      } else {
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "El JWT es valido";
        obj_respuesta.payload = decoded;
        obj_respuesta.status = 200;
        response.status(obj_respuesta.status).json(obj_respuesta);
      }
    });
  }
});

// CRUD USUARIOS **************************************************************************************
// Listar usuarios OK
app.get("/listarUsuariosBD", verificar_jwt, (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se encontraron usuarios",
    dato: {},
    status: 424,
  };
  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("SELECT * FROM usuarios", (err, rows) => {
      if (err) throw "Error en consulta de base de datos.";
      if (rows.length == 0) {
        response.status(obj_respuesta.status).json(obj_respuesta);
      } else {
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Usuarios encontrados!";
        obj_respuesta.dato = rows;
        obj_respuesta.status = 200;
        response.status(obj_respuesta.status).json(obj_respuesta);
      }
    });
  });
});

// CRUD CLIENTES **************************************************************************************
// Agregar cliente
app.post("/agregarCliente", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo agregar el cliente",
    status: 418,
  };

  let cliente_json = {};
  cliente_json.id = request.body.id;
  cliente_json.nombre = request.body.nombre;
  cliente_json.dni = request.body.dni;
  cliente_json.edad = request.body.edad;
  cliente_json.altura = request.body.altura;
  cliente_json.telefono = request.body.telefono;
  cliente_json.facebook = request.body.facebook;
  cliente_json.instagram = request.body.instagram;
  cliente_json.direccion = request.body.direccion;
  cliente_json.id_control = request.body.id;
  cliente_json.estado = request.body.estado;

  let control = request.body.control[0];
  control.id = cliente_json.id;

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("INSERT INTO clientes set ?", [cliente_json], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
    });
  });

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("INSERT INTO controles set ?", [control], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
      obj_respuesta.exito = true;
      obj_respuesta.mensaje = "Cliente agregado!";
      obj_respuesta.status = 200;
      response.status(obj_respuesta.status).json(obj_respuesta);
    });
  });
});

// Listar clientes
app.get("/listarClientes", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se encontraron clientes",
    dato: {},
    status: 424,
  };

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("SELECT * FROM clientes", (err, rows) => {
      if (err) throw "Error en consulta de base de datos.";
      if (rows.length == 0) {
        response.status(obj_respuesta.status).json(obj_respuesta);
      } else {
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Clientes encontrados!";
        obj_respuesta.dato = rows;
        obj_respuesta.status = 200;
        response.status(obj_respuesta.status).json(rows);
      }
    });
  });
});

// Modificar cliente
app.post("/modificarCliente", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo modificar el cliente",
    status: 418,
  };

  let cliente_json = {};
  cliente_json.id = request.body.id;
  cliente_json.nombre = request.body.nombre;
  cliente_json.dni = request.body.dni;
  cliente_json.edad = request.body.edad;
  cliente_json.altura = request.body.altura;
  cliente_json.telefono = request.body.telefono;
  cliente_json.facebook = request.body.facebook;
  cliente_json.instagram = request.body.instagram;
  cliente_json.direccion = request.body.direccion;
  cliente_json.id_control = request.body.id;
  cliente_json.estado = request.body.estado;

  let control = request.body.control;

  control.forEach((c) => {
    request.getConnection((err, conn) => {
      if (err) throw "Error al conectarse a la base de datos.";
      conn.query("UPDATE controles SET ? WHERE id = ? AND fecha = ?", [c, c.id, c.fecha], (err, rows) => {
        if (err) {
          console.log(err);
          throw "Error en consulta de base de datos.";
        }
      });
    });
  });

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("UPDATE clientes SET ? WHERE id = ?", [cliente_json, cliente_json.id], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
      obj_respuesta.exito = true;
      obj_respuesta.mensaje = "Cliente Modificado!";
      obj_respuesta.status = 200;
      response.status(obj_respuesta.status).json(obj_respuesta);
    });
  });
});

// Eliminar cliente
app.post("/eliminarCliente", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo eliminar el cliente",
    status: 418,
  };

  let cliente_json = {};
  cliente_json.id = request.body.id;

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("DELETE FROM clientes WHERE id = ?", [cliente_json.id], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
    });
  });

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("DELETE FROM controles WHERE id = ?", [cliente_json.id], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
      obj_respuesta.exito = true;
      obj_respuesta.mensaje = "Cliente Eliminado!";
      obj_respuesta.status = 200;
      response.status(obj_respuesta.status).json(obj_respuesta);
    });
  });
});

// CRUD CONTROLES **************************************************************************************
// Agregar control
app.post("/agregarControl", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo agregar el control",
    status: 418,
  };

  let control_json = {};
  control_json.id = request.body.id;
  control_json.fecha = request.body.fecha;
  control_json.peso = request.body.peso;
  control_json.pecho = request.body.pecho;
  control_json.cintura = request.body.cintura;
  control_json.ombligo = request.body.ombligo;
  control_json.cadera = request.body.cadera;
  control_json.biceps = request.body.biceps;
  control_json.muslos = request.body.muslos;
  control_json.objetivo = request.body.objetivo;

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("INSERT INTO controles set ?", [control_json], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
      obj_respuesta.exito = true;
      obj_respuesta.mensaje = "Control agregado!";
      obj_respuesta.status = 200;
      response.status(obj_respuesta.status).json(obj_respuesta);
    });
  });
});

// Listar Controles
app.get("/listarControles", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se encontraron controles",
    dato: {},
    status: 424,
  };

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("SELECT * FROM controles", (err, rows) => {
      if (err) throw "Error en consulta de base de datos.";
      if (rows.length == 0) {
        response.status(obj_respuesta.status).json(obj_respuesta);
      } else {
        obj_respuesta.exito = true;
        obj_respuesta.mensaje = "Controles encontrados!";
        obj_respuesta.dato = rows;
        obj_respuesta.status = 200;
        response.status(obj_respuesta.status).json(rows);
      }
    });
  });
});

// Modificar control
app.post("/modificarControl", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo modificar el control",
    status: 418,
  };

  let control_json = {};
  control_json.id = request.body.id;
  control_json.fecha = request.body.fecha;
  control_json.peso = request.body.peso;
  control_json.pecho = request.body.pecho;
  control_json.cintura = request.body.cintura;
  control_json.ombligo = request.body.ombligo;
  control_json.cadera = request.body.cadera;
  control_json.biceps = request.body.biceps;
  control_json.muslos = request.body.muslos;
  control_json.objetivo = request.body.objetivo;

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("UPDATE controles SET ? WHERE id = ? AND fecha = ?", [control_json.id, control_json.fecha], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
      obj_respuesta.exito = true;
      obj_respuesta.mensaje = "Control modificado!";
      obj_respuesta.status = 200;
      response.status(obj_respuesta.status).json(obj_respuesta);
    });
  });
});

// Eliminar control
app.post("/eliminarControl", (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo eliminar el control",
    status: 418,
  };

  let control_json = {};
  control_json.id = request.body.id;
  control_json.fecha = request.body.fecha;
  control_json.peso = request.body.peso;
  control_json.pecho = request.body.pecho;
  control_json.cintura = request.body.cintura;
  control_json.ombligo = request.body.ombligo;
  control_json.cadera = request.body.cadera;
  control_json.biceps = request.body.biceps;
  control_json.muslos = request.body.muslos;
  control_json.objetivo = request.body.objetivo;

  request.getConnection((err, conn) => {
    if (err) throw "Error al conectarse a la base de datos.";
    conn.query("DELETE FROM controles WHERE id = ? AND fecha = ?", [control_json.id, control_json.fecha], (err, rows) => {
      if (err) {
        console.log(err);
        throw "Error en consulta de base de datos.";
      }
      obj_respuesta.exito = true;
      obj_respuesta.mensaje = "Control eliminado!";
      obj_respuesta.status = 200;
      response.status(obj_respuesta.status).json(obj_respuesta);
    });
  });
});

app.listen(app.get("puerto"), () => {
  console.log("Servidor corriendo sobre puerto:", app.get("puerto"));
});
//# sourceMappingURL=servidor.js.map
