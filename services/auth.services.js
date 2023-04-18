require ('dotenv').config()
const Joi = require("joi");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel");
const Vonage = require('@vonage/server-sdk')

const vonsecret= process.env.VONAGE_SECRET
const vonkey= process.env.VONAGE_KEY
const vonage = new Vonage({
  apiKey: `${vonkey}`,
  apiSecret: `${vonsecret}`
})

const sendSMS = (to, text) =>{
  const from="EduSearch"
  
  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
}

const generateOTP = async (phone) => {
  try {
    const gen = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otp = await bcrypt.hash(gen, 8);

    const otpHolder = await OTP.find({ number: phone });
    if (otpHolder.length === 1) {
      await OTP.updateOne({ otp: otp }, { number: phone });
    } else {
      await OTP.create({ number: phone, otp: otp });
    }
    return gen;
  } catch (error) {
    return error;
  }
};


const validateUser = (person) => {
  const schema = Joi.object({
    FirstName: Joi.string().required().min(3),
    LastName: Joi.string().required().min(3),
    Password: Joi.string().required().min(6),
    Phonenumber: Joi.string().required().max(10).min(10).allow(""),
    Email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
      .allow(""),
  });
  return schema.validate(person);
};

const validateLogin = (person) => {
  const schema = Joi.object({
    Phonenumber: Joi.string().required().max(10).min(10).allow(""),
    Password: Joi.string().required().min(6),
  });
  return schema.validate(person);
};
const validateOTP = (person) => {
  const schema = Joi.object({
    Phonenumber: Joi.string().required().max(10).min(10).allow(""),
    otp: Joi.string().required().min(6).max(6),
  });
  return schema.validate(person);
};
//otp verification
const verifyOTP = async (phone, otp) =>{
  try {
      const otpHolder= await OTP.find({
        number: phone
      });
      if (otpHolder < 1) {
        return 'expired';
      }
      var valid=await bcrypt.compare(otp,otpHolder[0].otp);

      if(valid){return "valid";}
      return "wrong";                 
  } catch (error) {
      return error
  }
}
const validateSchool = (person) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    Location: Joi.string().required().min(3),
    // phonenumber: Joi.string().required().max(10).min(10).allow(""),
    // email: Joi.string()
    //   .required()
    //   .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
    //   .allow(""),
    level: Joi.string().required().min(3),
    curriculum: Joi.string().required().min(3),
    price: Joi.number().required().min(500),
    size: Joi.number().required().min(2),
    rating: Joi.number().required().min(0).max(5),
    ImgUrl: Joi.string().required().min(3),
    isSaved: Joi.boolean().required()
  });

 
  return schema.validate(person);
};
module.exports = {
  validateUser,
  validateLogin,
  generateOTP,
  verifyOTP,
  validateOTP,
  sendSMS,
  validateSchool
};
