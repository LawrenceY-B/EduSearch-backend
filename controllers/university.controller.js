const { Uni, coursemodel } = require("../models/university");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validatesearchcourse } = require("../services/uni.service");
const { extractMail } = require("../services/school.service");

const searchCourses = async (req, res, next) => {
  try {
    const { course, aggregate, skills, feepaying } = req.body;
    const { error } = validatesearchcourse(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    const userData = extractMail(req, res);
    let userEmail = userData.userEmail;
    if (!userEmail) {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const search = coursemodel
      .find({
        prerequisitePrograms: { $in: course },
        skills: { $in: skills },
        fee_paying_cut_off_points: { $gte: aggregate },
      })
      .populate({ path: "universityId", select: "-Programs" });

    if (!feepaying) {
      search.where("cut_off_points").gte(aggregate);
    }
    const searchresults = await search.exec();

    if (searchresults == null || searchresults.length == 0) {
      throw new Error("No courses found");
    }

    res.status(201).json({
      success: true,
      message: `${searchresults.length} courses found`,
      search: searchresults,
    });
  } catch (Error) {
    next(Error);
  }
};
const getSkills = async (req, res, next) => {
  try {
    const skills = await coursemodel.find().distinct("skills");
    res.status(201).json({ success: true, skills: skills });
  } catch (error) {
    next(error);
  }
};
module.exports = { searchCourses, getSkills };
