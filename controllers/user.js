require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const bcrypt = require("bcrypt");

// generating the JWT tocken using the id and useremail id

const generateAccessToken = (id, email) => {
  const secretKey = process.env.JSONWEB_SECRET_KEY;
  const payload = { userId: id, email };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

// singUp process

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const inicryptedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name: name,
      email: email,
      password: inicryptedPassword,
    });
    res.status(200).json(user);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403).json({ message: "Email address is already in use." });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
  }
};

//login Process

exports.logincheck = async (req, res) => {
  let email1 = req.body.email;
  let password1 = req.body.password;
  let user = await User.findOne({ where: { email: email1 } });
  if (user) {
    const passwordMatch = await bcrypt.compare(password1, user.password);
    if (passwordMatch) {
      //  now this time we are calling the JWT
      const token = generateAccessToken(user.id, user.email);

      res
        .status(200)
        .json({
          message: "user loging successfully",
          token: token,
          user: user,
        });
    } else {
      res.status(401).json({ message: "You entered Wrong Passwprd" });
    }
  } else {
    res.status(404).json({ message: "user is not found" });
  }
};
