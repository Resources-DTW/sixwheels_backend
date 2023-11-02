const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DriverSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    mobileNumber: String,
    email: String,
    license: String,
    serviceProvider: String,
    password: String,
    policyAccepted: {
      type: Boolean,
      default: false,
      
    },
    number: String,
  },
  { timestamps: true }
);

const Drivers = mongoose.model("Drivers", DriverSchema);
module.exports = Drivers;
