const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth");

const {
  UserModel,
  validateUser,
  validLogin,
  createToken,
} = require("../models/userModel");

router.post("/register", async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    console.log(user);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*****";
    res.status(201).json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(500)
        .json({ message: "Email already in system, try login" });
    }
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem, try again later", err });
  }
});

router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.find({ email: req.body.email });
    if (user.length == 0) {
      return res
        .status(401)
        .json({ message: "Email or password worng , code 1" });
    }
    let passOk = await bcrypt.compare(req.body.password, user[0].password);
    if (!passOk) {
      return res
        .status(401)
        .json({ message: "Email or password worng , code 2" });
    }
    let newToken = createToken(user[0]._id, user[0].role);
    res.json({ token: newToken });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem, try again later", err });
  }
});

router.get("/myEmail", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.token._id }, { email: 1 });
    res.json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem, try again later", err });
  }
});

router.get("/allInfo", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.token._id }, { password: 0 });
    res.json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There is a problem, try again later", err });
  }
});

module.exports = router;
