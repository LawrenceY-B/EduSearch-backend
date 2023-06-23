const { Uni, coursemodel } = require("../models/university");
const jwt = require("jsonwebtoken");
const { validatecourses, validateuni, extractId } = require("../services/uni.service");

const Addnewuniversity = async (req, res) => {
  try {
    const { error } = validateuni(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    // console.log(req.body);
    let { name, phone, location, website, address, email } = req.body;
    const Phonenumber = phone.replace(phone.slice(0, 1), "233");
    const existing = await Uni.findOne({ name: name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "University already exists",
      });
    }
    const result = await Uni.create({
      name,
      phone: Phonenumber,
      location,
      website,
      address,
      email,
    });
    if (!result) {
      return res
        .status(400)
        .json({ succcess: false, message: "Couldn't add university" });
    }
    return res.status(200).json({
      succcess: true,
      message: "The university has been succesfully added",
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

const Addcourses = async (req, res) => {
  try {
    const { error } = validatecourses(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });
    const {
      course_id,
      name,
      description,
      prerequisites,
      cut_off_points,
      fee_paying,
      application_fee,
      admission_costs,
      other_info,
      course_description,
    } = req.body;

    const existing = await coursemodel.findOne({ name: name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }
    
    // extract id from token
    // add to course model
    const adminData = extractId(req, res);
    // console.log(adminData);
    let adminId= adminData._id;

    const result = await coursemodel.create({
      course_id,
      university:
      name,
      description,
      prerequisites,
      cut_off_points,
      fee_paying,
      application_fee,
      admission_costs,
      other_info,
      course_description,
    });
    if (!result) {
      return res
        .status(400)
        .json({ succcess: false, message: "Couldn't add course" });
    }
    
    // populate the school model with the courses
    // let courses = await coursemodel.findOne({ Email: userEmail }).populate({
    //   path: "FavoriteSchools",
    //   populate: {
    //     path: "School",
    //     options: { strictPopulate: false },
    //   },
    // });
    return res.status(200).json({ succcess: true, message: "Course added" });

  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }

};

module.exports = { Addnewuniversity, Addcourses };
