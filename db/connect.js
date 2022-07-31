const mysql = require("mysql");
const myconn = require("express-myconnection");
const db_options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "clientes_bd",
};

module.exports = {
  mysql,
  myconn,
  db_options,
};
