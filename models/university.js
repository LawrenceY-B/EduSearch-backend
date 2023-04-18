const mongoose = require('mongoose');

const { Schema } = mongoose;

const contactInfoSchema = new Schema({
  address: String,
  phone: String,
  email: String,
});

const courseSchema = new Schema({
  course_id: Number,
  name: String,
  description: String,
  prerequisites: String,
  cut_off_points: String,
  fee_paying: Boolean,
  application_fee: String,
  admission_costs: String,
  other_info: String,
  course_description: String,
  skills: [String],
  career_paths: [String],
});

const universitySchema = new Schema({
  university_id: Number,
  name: String,
  location: String,
  website: String,
  contact_info: contactInfoSchema,
  courses: [courseSchema],
});



const Uni = mongoose.model('University', universitySchema);

module.exports = Uni;
