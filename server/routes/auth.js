const express = require("express");
const {
  welcome,
  preRegister,
  register,
  login
} = require("../controllers/auth")

const router = express.Router();

router.get("/", welcome);
router.post("/pre-register", preRegister)
router.post("/register", register)
router.post("/login", login)

module.exports = router;