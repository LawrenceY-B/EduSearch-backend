const sch = require("../models/schoolModel");
const Admin = require("../models/SchoolAdmin");
const mongoose = require('mongoose');


const {
  validateSchool,
  extractMail,
  validateAdditionalData,
} = require("../services/school.service");

const AddNewSchool = async (req, res) => {
  try {
    const { error } = validateSchool(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const {
      Name,
      Email,
      Phone,
      Curriculum,
      Level,
      Size,
      Background,
      ImgUrl,
      Price,
      Rating,
      Location,
    } = req.body;
    const Phonenumber = Phone.replace(Phone.slice(0, 1), "233");
    const school = await sch.findOne({ Name: Name });
    if (school) {
      throw new Error("School already exists");
    }
    // const extract = extractMail(req, res);
    // const AdminId = extract.AdminId;
    // const objectId = mongoose.Types.ObjectId(AdminId);

    // console.log(JSON.stringify(objectId));
    // const existingAdmin = await Admin.findOne({ id: objectId });

    // if (!existingAdmin) {
    //   throw new Error("Admin does not exist");
    // }
    const result = sch.create({
      // AdminId,
      Name,
      Email,
      Phone: Phonenumber,
      Curriculum,
      Level,
      Size,
      Background,
      ImgUrl,
      Price,
      Rating,
      Location,
    });
    // existingAdmin.populate({
    //   path: "SchoolData",
    // });
    if (result) {
      return res
        .status(200)
        .json({ succcess: true, message: "School has been succesfully added" });
    } else {
      throw new Error("School could not be added");
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const AddAdditionalData = async (req, res) => {
  try {
    const { error } = validateAdditionalData(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { Facilities, Admission, ExtracurricularActivity, MissionStatement } =
      req.body;
    const extract = extractMail(req, res);
    console.log(JSON.stringify(extract));
    // const userEmail = extract.userEmail;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const DeleteSchool = (req, res) => {};

module.exports = { AddNewSchool, DeleteSchool, AddAdditionalData };
