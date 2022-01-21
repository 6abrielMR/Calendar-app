const { Router } = require("express");
const { check } = require("express-validator");
const { fieldValidators } = require("../middlewares/field-validators");
const { createUser, login, renewToken } = require("../controllers/auth");
const { jwtValidator } = require("../middlewares/jwt-validator");

const router = Router();

router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidators,
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidators,
  ],
  login
);

router.get("/renew", jwtValidator, renewToken);

module.exports = router;
