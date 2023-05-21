const mongoose = require("mongoose");

const { Schema } = mongoose;
const AdditionalDataSchema = new Schema({
    SchoolID: {
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
  module.exports = AdditionalData;
 