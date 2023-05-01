const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../models/user.model");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//registration
userRouter.post("/register", async (req, res) => {
  const { email, pass, location, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      const user = new UserModel({ email, pass: hash, location, age });
      await user.save();
      res.status(200).send({ msg: "Registration is successful!!" });
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      console.log(user._id);
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login successful",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Wrong credentials" });
        }
      });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

//details
userRouter.get("/details", (req, res) => {
  const { token } = req.query;
  jwt.verify(token, "bruce", function (err, decoded) {
    decoded
      ? res.status(200).send("User details")
      : res
          .status(400)
          .send({ msg: "Login required, this is protected route" });
  });
});

//movies
userRouter.get("/movies", (req, res) => {
  const { token } = req.query;
  jwt.verify(token, "bruce", function (err, decoded) {
    decoded
      ? res.status(200).send("Movie details")
      : res
          .status(400)
          .send({ msg: "Login required, this is protected route" });
  });
});

module.exports = { userRouter };
