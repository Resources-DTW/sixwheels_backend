const Drivers = require("../models/Drivers");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    try {
      const newDriver = new Drivers({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        license: req.body.license,
        serviceProvider: req.body.serviceProvider,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET
        ).toString(),
      });
      const savedDriver = await newDriver.save();
      res.status(201).json({ message: "Driver Successfully Created" });
    } catch (error) {
      console.error(error); // Log the error for debugging.
      res
        .status(500)
        .json({ error: "An error occurred while creating the driver." });
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await Drivers.findOne({ username: req.body.email });
      if (!user) {
        return res.status(401).json("Your username is incorrect");
      }

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decryptedpass = hashedPassword.toString(CryptoJS.enc.Utf8);

      if (decryptedpass !== req.body.password) {
        return res.status(401).json("Wrong Password!");
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        { expiresIn: "7d" }
      );

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
