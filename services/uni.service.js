const Joi = require("joi");
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;

const validateuni = (universityDetails) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    phone: Joi.string().max(10).min(10).allow("").required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org"] },
      })
      .required()
      .allow(""),
    location: Joi.string().min(3).required(),
    website: Joi.string().min(3).uri().required(),
    address: Joi.number().min(3).required(),
  });
  return schema.validate(person);
};
 module.exports = {validateuni}
