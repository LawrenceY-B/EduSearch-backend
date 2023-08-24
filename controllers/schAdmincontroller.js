const sch = require("../models/schoolModel");
const Admin = require("../models/SchoolAdmin");
const mongoose = require("mongoose");

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
      Facilities,
      ExtracurricularActivity,
      MissionStatement,
      AdmissionDetails,
    } = req.body;
    const Phonenumber = Phone.replace(Phone.slice(0, 1), "233");
    const school = await sch.findOne({ Name: Name });
    if (school) {
      throw new Error("School already exists");
    }
    const extract = extractMail(req, res);
    const AdminID = extract.AdminId;
    console.log(AdminID);
    const existingAdmin = await Admin.findOne({ _id: AdminID });
    console.log(existingAdmin);
    if (!existingAdmin) {
      throw new Error("Admin does not exist");
    }
    const result = sch.create({
      AdminID,
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
      Facilities,
      ExtracurricularActivity,
      MissionStatement,
      AdmissionDetails,
    });
    const trial = await Admin.findOne({ _id: AdminID })
      .populate({ path: "Schooldata", model: "schools" })
      .select("-password -email");
    if (result) {
      return res.status(200).json({
        succcess: true,
        message: "School has been succesfully added",
        data: trial,
      });
    } else {
      throw new Error("School could not be added");
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const DeleteSchool = (req, res) => {};

module.exports = { AddNewSchool, DeleteSchool };
