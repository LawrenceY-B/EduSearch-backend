const Joi = require("joi");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;

const validateuni = (universityDetails) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().allow("").required().max(10).min(10),
    email: Joi.string().email().required().allow(""),
    location: Joi.string().min(3).required(),
    website: Joi.string().min(3).uri().required(),
    address: Joi.string().min(3).required(),
  });
  return schema.validate(universityDetails);
};
const validatesearchcourse = (courseDetails) => {
  const schema = Joi.object({
    course: Joi.string().min(3).required(),
    aggregate: Joi.number().min(6).required(),
    skills: Joi.array().items(Joi.string()),
  });
  return schema.validate(courseDetails);
};
const validatecourses = (courseDetaiils) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(3).required(),
    prerequisites: Joi.string().min(3).required(),
    prerequisitePrograms: Joi.array().items(Joi.string().min(3).required()),
    cut_off_points: Joi.number().min(6).required(),
    fee_paying: Joi.boolean().required(),
    fee_paying_cut_off_points: Joi.number().min(6),
    application_fee: Joi.string().min(3).required(),
    admission_costs: Joi.string().min(3).required(),
    other_info: Joi.string().min(3).required(),
    course_description: Joi.string().min(3).required(),
    skills: Joi.array().items(Joi.string().min(3).required()),
    career_paths: Joi.array().items(Joi.string().min(3).required()),
  });
  return schema.validate(courseDetaiils);
};
const extractId = (req, res) => {
  try {
    const fullheader = req.get("Authorization");
    if (!fullheader || !fullheader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }
    const token = fullheader.split(" ")[1];
    if (!token) {
      return res.status(401).json("Unauthorized");
    }
    // console.log(token);
    const decoded = jwt.decode(token, tokenkey);
    // console.log(decoded);
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  validateuni,
  validatecourses,
  extractId,
  validatesearchcourse,
};
