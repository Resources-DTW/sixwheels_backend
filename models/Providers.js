const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProviderSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    services: String,
    mobileNumber: String,
    email: String,
    companyName: String,
    companyCR: String,
    companyTiming: String,
    password: String,
    verified: {
      type: Boolean,
      default: false,
    },
    number: String,
  },
  { timestamps: true }
);

const Providers = mongoose.model("Providers", ProviderSchema);
module.exports = Providers;
