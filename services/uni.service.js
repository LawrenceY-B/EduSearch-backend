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
    address: Joi.string().min(3).required(),
  });
  return schema.validate(universityDetails);
};
const validatecourses = (courseDetaiils) => {
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  prerequisites: Joi.string().min(3).required(),
  cut_off_points: Joi.number().min(6).required(),
  fee_paying: Joi.boolean().required(),
  application_fee: Joi.string().min(3).required(),
  admission_costs: Joi.string().min(3).required(),
  other_info: Joi.string().min(3).required(),
  course_description: Joi.string().min(3).required(),
 
})
return schema.validate(courseDetaiils)
}
 module.exports = {validateuni, validatecourses}
