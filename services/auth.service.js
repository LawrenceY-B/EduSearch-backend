require("dotenv").config();
const Joi = require("joi");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel");
const Vonage = require("@vonage/server-sdk");

const vonsecret = process.env.VONAGE_SECRET;
const vonkey = process.env.VONAGE_KEY;
const vonage = new Vonage({
  apiKey: `${vonkey}`,
  apiSecret: `${vonsecret}`,
});

const sendSMS = (to, text) => {
  const from = "EduSearch";

  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};

const generateOTP = async (phone) => {
  try {
    const otplength = 6
    let gen = otpGenerator.generate(otplength, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otp = await bcrypt.hash(gen, 8);

    const existingOTP = await OTP.findOne({ number: phone });
    if (existingOTP) {
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

const validateAdmin = (person) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    password: Joi.string().required().min(6),
    phone: Joi.string().required().max(10).min(10).allow(""),
    email: Joi.string()
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
const validateAdminLogin = (person) => {
  const schema = Joi.object({
    phone: Joi.string().required().max(10).min(10).allow(""),
    password: Joi.string().required().min(6),
  });
  return schema.validate(person);
};
const validateOTP = (person) => {
  const schema = Joi.object({
    Phonenumber: Joi.string().required().max(10).min(10),
    otp: Joi.string().required().min(6).max(6),
  });
  return schema.validate(person);
};

/**
 * Verify OTP for a given phone number
 * @param {string} phone - The phone number to verify
 * @param {string} otp - The OTP to verify
 * @returns {string} - Returns "valid" if the OTP is valid, "wrong" if the OTP is invalid, or "expired" if the OTP has expired
 */
const verifyOTP = async (phone, otp) => {
  try {
    const otpHolder = await OTP.findOne({
      number: phone,
    });
    if (!otpHolder) {
      return "expired";
    }
    if (await bcrypt.compare(otp, otpHolder.otp)) {
      return "valid";
    }
    return "wrong";
  } catch (error) {
    throw error;
  }
};

/**
 * validute use phone number
 * @param {*} pass 
 * @returns 
 */
const validatePhoneNumber = (phone)=>{
  const schema = Joi.object({
    Phonenumber: Joi.string().required().max(10).min(10).allow(""),
  })
  return schema.validate(phone);
}
const validatePassword = (pass) => {
  const schema = Joi.object({
    NewPassword: Joi.string().required().min(6),
    ConfirmNewPassword: Joi.ref('NewPassword'),
  });
  return schema.validate(pass);
};
module.exports = {
  validateUser,
  validateLogin,
  generateOTP,
  verifyOTP,
  validateOTP,
  sendSMS,
  validatePassword,
  validatePhoneNumber,
  validateAdmin,
  validateAdminLogin
};
