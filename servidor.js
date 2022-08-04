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
const controlRouter = require("./routes/controlRoutes");

// Routes
app.use("/login", authRouter);
app.use("/clientes", clienteRouter);
app.use("/controles", controlRouter);

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
