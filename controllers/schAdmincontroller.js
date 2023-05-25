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
      name,
      email,
      phone,
      curriculum,
      level,
      size,
      background,
      ImgUrl,
      price,
      rating,
      location,
    } = req.body;
    const Phonenumber = phone.replace(phone.slice(0, 1), "233");
    const school = await sch.findOne({ Name: name });
    if (school)
      return res
        .status(403)
        .json({ success: false, message: "School already exists" });
    const result = sch.create({
      Name: name,
      Email: email,
      Phone: Phonenumber,
      Curriculum: curriculum,
      Level: level,
      Size: size,
      Background: background,
      ImgUrl: ImgUrl,
      Price: price,
      Rating: rating,
      Location: location,
      IsVerified: false,
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
