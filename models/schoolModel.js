const mongoose = require("mongoose");

const { Schema } = mongoose;

const schoolSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  curriculum: { type: String, required: true },
  level: { type: String, required: true },
  size: { type: Number, required: true },
  background: { type: String, required: true },
  imgUrl: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  location: { type: String, required: true },
  isVerified: { type: Boolean },
  AOB: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolData",
    },
  ],
});
const AdditionalDataSchema = new Schema({
  SchoolID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schools",
  },
  Facilities: { type: String, required: true },
  ExtracurricularActivity: { type: String, required: true },
  Missionstatement: { type: String, required: true },
  Admissiondetails: { type: String, required: true },
  imgUrl: { type: String },
});
const AdditionalData = mongoose.model("SchoolData", AdditionalDataSchema);
const Sch = mongoose.model("Schools", schoolSchema);
module.exports = {
  Sch,
  AdditionalData,
};
