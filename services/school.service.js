const Joi = require("joi");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;
//Identify the cause of the error
const validateSchool = (school) => {
  const schema = Joi.object({
    name: Joi.string().required.min(3),
    email: Joi.string()
      .required.email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org"] },
      })
      .allow(""),
    phone: Joi.string().required().max(10).min(10).allow(""),
    curriculum: Joi.string().required().min(3),
    level: Joi.string().required().min(3),
    size: Joi.number().required().min(3),
    background: Joi.string().required().min(3),
    price: Joi.number().required().min(550),
    rating: Joi.string().required().min(3),
    location: Joi.string().required().min(3),
    ImgUrl: Joi.string().required().min(3).uri(),
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
  const fullheader = req.get("Authorization");
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
    rating: Joi.string().required().min(3),
    location: Joi.string().required().min(3),
  });
  return schema.validate(query);
};
module.exports = {
  validateSchool,
  validateFav,
  extractMail,
  validateQuery,
};
