const {
  sesConnection,
  EMAIL_FROM,
  EMAIL_TO,
  JWT_SECRET,
} = require("../../config");
const { emailTemplate } = require("../helpers/email");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/auth");
const nanoid = require("nanoid");
const emailValidator = require("email-validator");

const welcome = (req, res) => {
  res.json({
    data: "hello from node js api",
  });
};

const preRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!emailValidator.validate(email)) {
      return res.json({ err: "A valid email is required!" });
    }
    if (!password || password?.length < 6) {
      return res.json({
        err: "Password is required or password must be greater than 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ err: "User already exists!" });
    }

    const token = jwt.sign({ email, password }, JWT_SECRET, {
      expiresIn: "1h",
    });

    sesConnection.sendEmail(
      emailTemplate(
        email,
        `<p>Please click link below to activate your account</p>
    <a href="localhost:3000/auth/activate-account/${token}">Active your account</a>`,
        EMAIL_TO,
        "Activate your Account"
      ),
      (err, data) => {
        if (err) {
          return res.json({ ok: false });
        } else {
          return res.json({ ok: true });
        }
      }
    );
  } catch (err) {
    return res.json({ err: "something went wrong, please try again..." });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = jwt.verify(req.body.token, JWT_SECRET);

    const hashedPassword = await hashPassword(password);
    console.log("hashedPassword: ", hashedPassword);

    const user = await new User({
      username: nanoid(),
      email,
      password: hashedPassword,
    }).save();

    const token = jwt.sign(
      {
        _id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.hashedPassword = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.log("err!: ", err);
    return res.json({ err: "registration failed..." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("user: ", user);
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.json({ err: "incorrect password!" });
    }

    const token = jwt.sign(
      {
        _id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.hashedPassword = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({ err: "Something went wrong!" });
  }
};

module.exports = { welcome, preRegister, register, login };
