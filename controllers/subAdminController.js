const SubAdmin = require("../models/SubAdmin");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createAdmin: async (req, res) => {
    try {
      const newSubAdmin = new SubAdmin({
        name: req.body.name,
        userName: req.body.userName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.SECRET
        ).toString(),
      });
      const savedSubAdmin = await newSubAdmin.save();
      res
        .status(201)
        .json({ message: "Sub Admin Successfully Created", savedSubAdmin });
    } catch (error) {
      console.error(error); // Log the error for debugging.
      res
        .status(500)
        .json({ error: "An error occurred while creating the sub admin." });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const user = await SubAdmin.findOne({ username: req.body.username });
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
