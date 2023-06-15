const { Uni, coursemodel } = require("../models/university");
const jwt = require("jsonwebtoken");
const { validatecourses, validateuni } = require("../services/uni.service");

const Addnewuniversity = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (decoded.AdminRole !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    }
    const { error } = validateuni(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });
    const { name, location, website, address, phone, email } = req.body;
    const Phonenumber = phone.replace(phone.slice(0, 1), "233");
    const result = await Uni.create(
      name,
      Phonenumber,
      location,
      website,
      address,
      email
    );
    if (result) {
      return res.status(200).json({
        succcess: true,
        message: "The university has been succesfully added",
      });
    } else {
      return res
        .status(400)
        .json({ succcess: false, message: "Couldn't add university" });
    }
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message });
  }
};

const Addcourses = async (req, res) => {
  const { error } = validatecourses(req.body);
  if (error)
    return res.status(400).json({ success: false, message: error.message });
};

module.exports = { Addnewuniversity, Addcourses };
