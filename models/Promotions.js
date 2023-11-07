const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromotionSchema = new Schema(
  {
    offerName: String,
    tankerType: String,
    tankerCapacity: String,
    discountType: String,
    discountValue: String,
    imagePath: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Promotions = mongoose.model("Promotions", PromotionSchema);
module.exports = Promotions;
