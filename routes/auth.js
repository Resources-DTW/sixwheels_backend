const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const driverController = require("../controllers/driverController");
const providersController = require("../controllers/providersController");
const subAdminController = require("../controllers/subAdminController");
require("dotenv").config();
// const accountSid = "AC2fcd0920bd986aadccf9a3aee4f4bcd7";
// const authToken = "b9b6d27fe400b0b8ab7f667093f7b532";
const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_SERVICE_SID } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

//Driver Auth
authRouter.post("/register", driverController.createUser);
authRouter.post("/login", driverController.loginUser);

//Provider Auth
authRouter.post("/registerprovider", providersController.createProvider);
authRouter.post("/loginprovider", providersController.loginProvider);

authRouter.post("/registeradmin", subAdminController.createAdmin);
authRouter.post("/loginadmin", subAdminController.loginAdmin);

//Customer Auth
authRouter.post("/registeruser", async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString(),
  });

  try {
    await newUser.save();
    res.status(201).json("User Successfully Created");
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

let OTP, user;
authRouter.post("/signup", async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const recipientPhoneNumber = req.body.mobileNumber;

    const existingUser = await User.findOne({
      mobileNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        msg: "User with same number already exists! Please try again different number",
      });
    }

    user = new User({
      mobileNumber,
    });
    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    await client.messages
      .create({
        body: `Your confirmation otp code: #${OTP} send from Sixwheels`,
        messagingServiceSid: TWILIO_SERVICE_SID,
        to: `+91${recipientPhoneNumber}`, //9080479236
      })
      .then(() => res.status(200).json({ msg: "Message Sent" }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/signup/verify", async (req, res) => {
  try {
    const { otp, verified } = req.body;
    if (otp != OTP) {
      return res.status(400).json({ msg: "Incorrect OTP" });
    }
    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.status(200).json({ token, ...user._doc });
    OTP = "";
    user = new User({
      ...user._doc,
      verified: true,
    });
    await user.save();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

let signinUser;
authRouter.post("/signin", async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const recipientPhoneNumber = req.body.mobileNumber;

    signinUser = await User.findOne({ mobileNumber });
    if (!signinUser) {
      return res.status(400).json({ msg: "This number does not exist!!" });
    }

    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    await client.messages
      .create({
        body: `Your confirmation otp code: #${OTP} send from Sixwheels`,
        messagingServiceSid: TWILIO_SERVICE_SID,
        to: `+91${recipientPhoneNumber}`, //9080479236
      })
      .then((message) => {
        res.status(200).json({ msg: "Message sent successfully" });
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/signin/verify", async (req, res) => {
  try {
    const { otp } = req.body;
    if (otp != OTP) {
      return res.status(400).json({ msg: "Incorrect OTP" });
    }
    const token = jwt.sign({ id: signinUser._id }, "passwordKey");
    res.status(200).json({ token, ...signinUser._doc });
    OTP = "";
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Get user
authRouter.get("/users/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all users
authRouter.get("/users", async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

//UPDATE
authRouter.put("/users/:id", async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
authRouter.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = authRouter;
