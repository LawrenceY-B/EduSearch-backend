const mongoose = require("mongoose");

const { Schema } = mongoose;

const schoolSchema = new Schema({
  AdminMail: { type: String, ref: "SchoolAdmin", required: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: Number, required: true },
  Curriculum: [{ type: String, required: true }],
  Level: [{ type: String, required: true }],
  Size: { type: Number, required: true },
  Background: [{ type: String, required: true }],
  ImgUrl: { type: String, required: true },
  Price: { type: Number, required: true },
  Rating: { type: Number, required: true },
  Location: { type: String, required: true },
  Facilities: { type: String, required: true },
  ExtracurricularActivity: { type: String, required: true },
  Missionstatement: { type: String, required: true },
  Admissiondetails: { type: String, required: true },
  // imgUrl: { type: String },
});

const Sch = mongoose.model("Schools", schoolSchema);
module.exports = Sch;
