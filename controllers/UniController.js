const { Uni, coursemodel } = require("../models/university");
const Admin = require("../models/UniversityAdmin");
const jwt = require("jsonwebtoken");
const {
  validatecourses,
  validateuni,
  extractId,
} = require("../services/uni.service");

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
    //work on populating the course in the university as well

    //work on populating the admin model with the university
    // let university = await Admin.findOne({ email:email}).populate({
    //   path: "UniversityId",
    //   populate: {
    //     path: "university",
    //     options: { strictPopulate: false },
    //   },
    // });
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
    const Universityname = req.query.Universityname;

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
    // 649505aefadf64e6b2f31cc2
    // let extracted = extractId(req, res);
    // const extractedId = extracted.AdminId;
    const existing = await Uni.findOne({ name: Universityname });
    if (!existing) {
      return res.status(400).json({
        success: false,
        message: "University does not exists",
      });
    }
    const universityId = existing._id;

    const existingcourse = await coursemodel
      .findOne({ name: name })
      .where("universityName")
      .equals(Universityname);
    if (existingcourse)
      return res.status(403).json({
        success: false,
        message: "Course already exists in University",
      });

    const result = await coursemodel.create({
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
      universityName: Universityname,
      universityId: universityId,
    });
    if (!result) {
      return res
        .status(400)
        .json({ succcess: false, message: "Couldn't add course" });
    }

    // populate the school model with the courses
    const pushCourse = await Uni.findOne({ name: Universityname });
    pushCourse.Programs.push(result);
    await pushCourse.save();

    return res.status(200).json({ succcess: true, message: "Course added" });
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

const GetAllCourses = async (req, res) => {
  try {
    const Universityname = req.query.Universityname;
    if (!Universityname) {
      return res
        .status(400)
        .json({ success: false, message: "University name is required" });
    }
    let Universitycourses = await Uni.findOne({
      name: Universityname,
    }).populate({
      path: "Programs",
      // populate: {
      //   path: "courses",
      //   options: { strictPopulate: false },
      // },
    });

    if (!Universitycourses) {
      res
        .status(404)
        .json({ success: false, message: "Error while fetching favorites" });
    } else {
      res.status(201).json({ success: true, courses: Universitycourses });
    }
  } catch (error) {
    res.status(501).json({ success: false, message: error.message });
  }
};
module.exports = { Addnewuniversity, Addcourses, GetAllCourses };
