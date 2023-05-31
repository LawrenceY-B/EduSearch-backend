const mongoose = require("mongoose");

const { Schema } = mongoose;

const universitySchema = new Schema({
  university_id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schools" }],
});

const courseSchema = new Schema({
  course_id: {type: mongoose.Schema.Types.ObjectId},
  name: {type:String, required: true},
  description: {type: String, required:true},
  prerequisites: {type: String, required:true},
  cut_off_points: {type: String, required:true},
  fee_paying: {type:Boolean, required:true},
  application_fee: {type: String, required:true},
  admission_costs: {type: String, required:true},
  other_info: {type: String, required:true},
  course_description: {type: String, required:true},
  skills: [{type:mongoose.Schema.Types.ObjectId, ref:"Skills"}],
  career_paths: [{type:mongoose.Schema.Types.ObjectId, ref:"Careers"}],
});

const skillSchema = new Schema({

})
const Uni = mongoose.model("University", universitySchema);
const coursemodel = mongoose.model("Course", courseSchema);

module.exports = {Uni, coursemodel};
