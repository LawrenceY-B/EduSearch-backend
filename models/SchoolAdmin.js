const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  Schooldata: [{ type: mongoose.Schema.Types.ObjectId, ref: "schools" }],
  isVerified: { type: Boolean },
  role: { type: String, required: true },
});

const SchoolAdmin = mongoose.model("schooladmin", AdminSchema);

module.exports = SchoolAdmin;
