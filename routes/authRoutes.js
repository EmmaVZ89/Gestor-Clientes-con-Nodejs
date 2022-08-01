const express = require("express");
const router = express.Router();

const { loginUser, checkLogin } = require("../controllers/authController");
const { verificar_usuario } = require("../middleware/authentication");

router.post("", verificar_usuario, loginUser);
router.get("", checkLogin);


module.exports = router;