const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fpassSchema = new Schema({
  number: { type: String, required: true },
  OneTimePassword: { type: String,index: { expires: 360 }},
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
},{ timestamps: true });
const Fpass = mongoose.model("FPASS", fpassSchema);

module.exports = Fpass;
