const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    mobileNumber: String,
    email: String,
    password: String,
    verified: {
      type: Boolean,
      default: false,
    },
    number: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
