require("dotenv").config();
const mysql = require("mysql");
const myconn = require("express-myconnection");
const db_options = {
  host: process.env.HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const connectMySQL = () => {
  return myconn(mysql, db_options, "single");
};

module.exports = {connectMySQL};
