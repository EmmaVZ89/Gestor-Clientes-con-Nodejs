const express = require("express");
const router = express.Router();
const { agregarCliente, listarClientes, modificarCliente, eliminarCliente } = require("../controllers/clientesController");
const { verificar_jwt } = require("../middleware/authentication");


router.post("/agregarCliente", verificar_jwt, agregarCliente);
router.get("/listarClientes", verificar_jwt, listarClientes);
router.post("/modificarCliente", verificar_jwt, modificarCliente);
router.post("/eliminarCliente", verificar_jwt, eliminarCliente);

module.exports = router;
