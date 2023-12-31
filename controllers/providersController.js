const Providers = require("../models/Providers");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createProvider: async (req, res) => {
    try {
      const newProvider = new Providers({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        services: req.body.services,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        companyName: req.body.companyName,
        companyCR: req.body.companyCR,
        companyTiming: req.body.companyTiming,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET
        ).toString(),
      });
      const savedProvider = await newProvider.save();
      res
        .status(201)
        .json({
          message: "Service Provider Successfully Created",
          savedProvider,
        });
    } catch (error) {
      console.error(error); // Log the error for debugging.
      res
        .status(500)
        .json({ error: "An error occurred while creating the driver." });
    }
  },

  loginProvider: async (req, res) => {
    try {
      const user = await Providers.findOne({ username: req.body.email });
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
