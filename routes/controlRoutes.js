const express = require("express");
const router = express.Router();
const {
  agregarControl,
  listarControles,
  modificarControl,
  eliminarControl,
} = require("../controllers/controlesController");
const { verificar_jwt } = require("../middleware/authentication");

router.post("/agregarControl", verificar_jwt, agregarControl);
router.get("/listarControles", verificar_jwt, listarControles);
router.post("/modificarControl", verificar_jwt, modificarControl);
router.post("/eliminarControl", verificar_jwt, eliminarControl);

module.exports = router;
