const express = require("express");

const bcryptjs = require("bcryptjs");

const app = express();

const path = require("path");

// VISTAS
app.get("/inicio", function (request, response) {
  response.sendFile(path.resolve(__dirname, "principal.html"));
});

app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "login.html"));
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
const { connectMySQL } = require("./db/connect");
app.use(connectMySQL());

// Routers
const authRouter = require("./routes/authRoutes");
const clienteRouter = require("./routes/clienteRoutes");

// Routes
app.use("/login", authRouter);
app.use("/clientes", clienteRouter);

// Middleware
const { verificar_jwt } = require("./middleware/authentication");


// CRUD CONTROLES **************************************************************************************
// Agregar control
app.post("/agregarControl", verificar_jwt, (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo agregar el control",
    status: 418,
  };

  let jwt = response.jwt;

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

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    response.status(obj_respuesta.status).json(obj_respuesta);
  } else {
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
  }
});

// Listar Controles
app.get("/listarControles", verificar_jwt, (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se encontraron controles",
    dato: {},
    status: 424,
  };

  // let pass = "pass"
  // let passHash = await bcryptjs.hash(pass, 8);
  // console.log(passHash);

  let jwt = response.jwt;

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    response.status(obj_respuesta.status).json(obj_respuesta);
  } else {
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
  }
});

// Modificar control
app.post("/modificarControl", verificar_jwt, (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo modificar el control",
    status: 418,
  };

  let jwt = response.jwt;

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

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    response.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    request.getConnection((err, conn) => {
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
          response.status(obj_respuesta.status).json(obj_respuesta);
        }
      );
    });
  }
});

// Eliminar control
app.post("/eliminarControl", verificar_jwt, (request, response) => {
  let obj_respuesta = {
    exito: false,
    mensaje: "No se pudo eliminar el control",
    status: 418,
  };

  let jwt = response.jwt;

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

  if (jwt.usuario.perfil !== "administrador") {
    obj_respuesta.mensaje = "Usuario sin permisos!!";
    obj_respuesta.status = 401;
    response.status(obj_respuesta.status).json(obj_respuesta);
  } else {
    request.getConnection((err, conn) => {
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
          response.status(obj_respuesta.status).json(obj_respuesta);
        }
      );
    });
  }
});

// Server start
const port = process.env.PORT || 2022;
const start = async () => {
  try {
    //
    app.listen(port, () => {
      console.log(`Servidor corriendo sobre puerto: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
