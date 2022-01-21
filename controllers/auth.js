const { response } = require("express");
const { generateJwt } = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!!user) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario ya existe con este correo",
      });
    }

    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJwt(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!!!user) {
      return res.status(400).json({
        ok: false,
        msg: "No se pudo iniciar sesión, revisa tus credenciales",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "No se pudo iniciar sesión, revisa tus credenciales",
      });
    }

    const token = await generateJwt(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generateJwt(uid, name);

  res.json({
    ok: true,
    token,
  });
};

module.exports = { createUser, login, renewToken };
