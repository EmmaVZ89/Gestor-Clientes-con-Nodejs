const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.get("/inicio", function (request, response) {
  response.sendFile(path.resolve(__dirname, "principal.html"));
});

app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "login.html"));
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

// MYSQL and EXPRESS-MYCONNECTION
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
