const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubAdminSchema = new Schema(
  {
    name: String,
    userName: String,
    phoneNumber: String,
    email: String,
    password: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SubAdmin = mongoose.model("SubAdmin", SubAdminSchema);
module.exports = SubAdmin;
