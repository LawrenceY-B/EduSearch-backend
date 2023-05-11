const Joi = require('joi');
const jwt = require("jsonwebtoken");
const tokenkey = process.env.TOKEN_KEY;


const validateSchool = (school) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        Location: Joi.string().required().min(3),
        level: Joi.string().required().min(3),
        curriculum: Joi.string().required().min(3),
        price: Joi.number().required().min(500),
        size: Joi.number().required().min(2),
        rating: Joi.number().required().min(0).max(5),
        ImgUrl: Joi.string().required().min(3).uri(),
    });


    return schema.validate(school);
};

const validateFav = (school) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
    });
    return schema.validate(school);
}
const extractMail=(req, res)=> {
    const fullheader = req.get("Authorization");
    const token = fullheader ? fullheader.split(" ")[1] : null;
    if (!token) {
      return res.status(401).json("Unauthorized");
    }
    try {
      const decoded = jwt.decode(token, `${tokenkey}`);
      return decoded.userEmail;
      
    } catch (error) {
      return res.status(401).json("Unauthorized");
    }
  }
module.exports = {
    validateSchool,
    validateFav,
    extractMail
};