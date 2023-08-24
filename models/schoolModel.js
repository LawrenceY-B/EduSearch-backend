const mongoose = require("mongoose");

const { Schema } = mongoose;

const schoolSchema = new Schema({
  AdminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schooladmin",
    required: true,
  },
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
  Facilities: { type: String, required: false },
  ExtracurricularActivity: { type: String, required: false },
  MissionStatement: { type: String, required: false },
  AdmissionDetails: { type: String, required: false },
});

const Sch = mongoose.model("schools", schoolSchema);
module.exports = Sch;
