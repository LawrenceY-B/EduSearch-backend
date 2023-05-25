const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  name:{type:String, required:true},
  email:{  type:String, required: true},
  password:{type:String, required: true},
  phone:{ type:String, required: true},
  SchoolData: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schools" }],
  isVerified:{type:Boolean},
  token:{type:String}
});

const SchoolAdmin = mongoose.model("SchoolAdmin", AdminSchema);

module.exports = SchoolAdmin;
