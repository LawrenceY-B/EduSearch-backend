const mongoose = require("mongoose");
const { Schema } = mongoose;

const searchSchema = new Schema({
  search_id: { type: mongoose.Schema.Types.ObjectId },
  CourseData: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  UserData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const searchmodel = mongoose.model("Search", searchSchema);
module.exports = searchmodel;
