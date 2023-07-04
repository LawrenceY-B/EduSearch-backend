const sch = require("../models/schoolModel");
const { validateSchool } = require("../services/school.service");

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
    if (school)
      return res
        .status(403)
        .json({ success: false, message: "School already exists" });
    const result = sch.create({
      Name,
      Email,
      Phone:Phonenumber,
      Curriculum,
      Level,
      Size,
      Background,
      ImgUrl,
      Price,
      Rating,
      Location,
    });
    if (result) {
      return res
        .status(200)
        .json({ succcess: true, message: "School has been succesfully added" });
    } else {
      return res
        .status(400)
        .json({ succcess: false, message: "Couldn't add school" });
    }
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const AddAdditionalData = async (req, res) => {};
const DeleteSchool = (req, res) => {};

module.exports = { AddNewSchool, DeleteSchool, AddAdditionalData };
