const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  number: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
},{ timestamps: true });
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
