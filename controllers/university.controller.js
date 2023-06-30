const { Uni, coursemodel } = require("../models/university");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validatesearchcourse } = require("../services/uni.service");

const searchCourses = async (req, res) => {
  try {
    const { course, aggregate, skills } = req.body;
    const { error } = validatesearchcourse(req.body);
    const feepaying=true
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    const search = await coursemodel
  
    console.log(search);

    if (search == null || search.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(201).json({ success: true, courses: search });
  } catch (error) {
    res.status(501).json({ success: false, message: error.message });
  }
};

module.exports = { searchCourses };
