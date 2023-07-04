const Joi = require("joi");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;
//Identify the cause of the error
const validateSchool = (school) => {
  const schema = Joi.object({
    Name: Joi.string().min(6).required(),
  Phone: Joi.string().max(10).min(10).allow("").required(),
    Email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    }).required().allow(""),
    Curriculum: Joi.array().items(Joi.string().min(2)).required(),
    Level: Joi.array().items(Joi.string().min(3)).required(),
    Size: Joi.number().min(1).required(),
    Background: Joi.array().items(Joi.string().min(3)).required(),
    Price: Joi.number().min(550).required(),
    Rating: Joi.string().min(0).required(),
    Location: Joi.string().min(3).required(),
    ImgUrl: Joi.string().min(3).uri().required(),
  });
  return schema.validate(school);
};

const validateFav = (school) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });
  return schema.validate(school);
};
const extractMail = (req, res) => {
const fullheader = req.get("Authorization") || req.get("Reset-Authorization");
  const token = fullheader ? fullheader.split(" ")[1] : null;
  if (!token) {
   throw new Error("Unauthorized");
  }
  try {
    const decoded = jwt.decode(token, `${tokenkey}`);
    return decoded;
  } catch (error) {
    throw new Error("Arggh");
  }
};
const extractResetMail = (req, res) => {
  const fullheader = req.header("Reset-Authorization");
    console.log(fullheader);
    const token = fullheader ? fullheader.split(" ")[1] : null;
    if (!token) {
     throw new Error("Unauthorized");
    }
    try {
      const decoded = jwt.decode(token, `${tokenkey}`);
      return decoded;
    } catch (error) {
      throw new Error("Arggh");
    }
  };
const validateQuery = (query) => {
  const schema = Joi.object({
    curriculum: Joi.string().required().min(3),
    level: Joi.string().required().min(3),
    minsize: Joi.number().required().min(3),
    maxsize: Joi.number().required().min(3),
    background: Joi.string().required().min(3),
    minprice: Joi.number().required().min(500),
    maxprice: Joi.number().required().min(550),
    rating: Joi.string().min(3),
    location: Joi.string().min(3),
  });
  return schema.validate(query);
};
module.exports = {
  validateSchool,
  validateFav,
  extractMail,
  validateQuery,
  extractResetMail
};
