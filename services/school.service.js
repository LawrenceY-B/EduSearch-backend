const Joi = require("joi");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;
//Identify the cause of the error
const validateSchool = (school) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
  
    phone: Joi.string().max(10).min(10).allow("").required(),
    email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    }).required().allow(""),
    curriculum: Joi.string().min(3).required(),
    level: Joi.string().min(3).required(),
    size: Joi.number().min(3).required(),
    background: Joi.string().min(3).required(),
    price: Joi.number().min(550).required(),
    rating: Joi.string().min(3).required(),
    location: Joi.string().min(3).required(),
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
    return res.status(401).json("Unauthorized");
  }
  try {
    const decoded = jwt.decode(token, `${tokenkey}`);
    return decoded;
  } catch (error) {
    return res.status(401).json("Unauthorized");
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
};
