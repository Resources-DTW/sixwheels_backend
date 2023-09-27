const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const accountSid = "AC2fcd0920bd986aadccf9a3aee4f4bcd7";
const authToken = "b9b6d27fe400b0b8ab7f667093f7b532";
const client = require("twilio")(accountSid, authToken, { lazyLoading: true });

let OTP, user;
authRouter.post("/signup", async (req, res) => {
  try {
    const { number } = req.body;
    const recipientPhoneNumber = req.body.number;

    const existingUser = await User.findOne({
      number,
    });
    if (existingUser) {
      return res.status(400).json({
        msg: "User with same number already exists! Please try again different number",
      });
    }

    user = new User({
      number,
    });
    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    await client.messages
      .create({
        body: `Your confirmation otp code: #${OTP} send from Sixwheels`,
        messagingServiceSid: "MG12562348e4429ace00cbd296da5de327",
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
    const { number } = req.body;
    const recipientPhoneNumber = req.body.number;

    signinUser = await User.findOne({ number });
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
        messagingServiceSid: "MG12562348e4429ace00cbd296da5de327",
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

module.exports = authRouter;
