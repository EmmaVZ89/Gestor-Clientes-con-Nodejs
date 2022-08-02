const express = require("express");
const router = express.Router();
const { agregarCliente, listarClientes } = require("../controllers/clientesController");
const { verificar_usuario, verificar_jwt } = require("../middleware/authentication");


router.post("agregarCliente", verificar_jwt, agregarCliente);
router.get("listarClientes", verificar_jwt, listarClientes);

module.exports = router;