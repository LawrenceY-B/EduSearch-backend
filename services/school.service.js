const Joi = require('joi');


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
        isSaved: Joi.boolean().required()
    });


    return schema.validate(school);
};

const validateFav = (school) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        Location: Joi.string().required().min(3),
        rating: Joi.number().required().min(0).max(5),
        ImgUrl: Joi.string().required().min(3).uri(),
        isSaved: Joi.boolean().required()
    });
    return schema.validate(school);
}

module.exports = {
    validateSchool,
    validateFav,
};