require("dotenv").config();
const Joi = require("joi");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel");
const Vonage = require("@vonage/server-sdk");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const MessageSID = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = require("twilio")(accountSid, authToken);
const {
        Upload
      } = require("@aws-sdk/lib-storage"),
      {
        S3
      } = require("@aws-sdk/client-s3");

// const vonsecret = process.env.VONAGE_SECRET;
// const vonkey = process.env.VONAGE_KEY;
// const vonage = new Vonage({
//   apiKey: `${vonkey}`,
//   apiSecret: `${vonsecret}`,
// });

const sendSMS = (to, text) => {
  client.messages
    .create({
      body: `${text}`,
      messagingServiceSid: `${MessageSID}`,
      to: `${to}`,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error(error));
};
// const from = "EduSearch";

// vonage.message.sendSms(from, to, text, (err, responseData) => {
//   if (err) {
//     console.log(err);
//   } else {
//     if (responseData.messages[0]["status"] === "0") {
//       console.log("Message sent successfully.");
//     } else {
//       console.log(
//         `Message failed with error: ${responseData.messages[0]["error-text"]}`
//       );
//     }
//   }
// });

const generateOTP = async (phone) => {
  try {
    const otplength = 6;
    let gen = otpGenerator.generate(otplength, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otp = await bcrypt.hash(gen, 8);
    let Number = {
      number: phone,
    };
    let onetimepass = { otp: otp };
    const existingOTP = await OTP.findOneAndUpdate(Number, onetimepass, {
      upsert: true,
      new: true,
    });
    // console.log("num" + gen + "otp" + existingOTP);

    return gen;
  } catch (error) {
    return error;
  }
};

const validateUser = (person) => {
  const schema = Joi.object({
    Name: Joi.string().required().min(3),
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
    role: Joi.string().required().min(3),
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
const validateProfile=(person)=>{
  const schema=Joi.object({
    Name: Joi.string().min(3),
    Phonenumber: Joi.string().max(10).min(10).allow(""),
    Email: Joi.string()
  })
  return schema.validate(person);
}

const ImageUpload = async (images) => {
  
  const awsS3 = new S3({
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
    region: "eu-west-2",
  });

  try {
    // Upload the image to S3
    const params = {
      Bucket: "edusearchbucket",
      Key: `${Date.now()}-${images.originalname}`,
      Body: images.buffer,
      ACL: "public-read", // Make the image publicly accessible
    };    
    const uploadedImage = await new Upload({
      client: awsS3,
      params
    }).done();
    return uploadedImage.Location;
  } catch (err) {
    console.log(err);  }
};
/**
 * Verify OTP for a given phone number
 * @param {string} phone - The phone number to verify
 * @param {string} otp - The OTP to verify
 * @returns {string} - Returns "valid" if the OTP is valid, "wrong" if the OTP is invalid, or "expired" if the OTP has expired
 */
const verifyOTP = async (phone, otp) => {
  try {
    const otpHolder = await OTP.findOne().where("number").equals(phone);
    if (!otpHolder) {
      return "expired";
    }
    const verify = await bcrypt.compare(otp, otpHolder.otp);
    if (verify) {
      return "valid";
    }
    return "wrong";
  } catch (error) {
    // console.log(error.message);
    throw error;
  }
};

/**
 * validute use phone number
 * @param {*} pass
 * @returns
 */
const validatePhoneNumber = (phone) => {
  const schema = Joi.object({
    Phonenumber: Joi.string().required().max(10).min(10).allow(""),
  });
  return schema.validate(phone);
};
const validatePassword = (pass) => {
  const schema = Joi.object({
    NewPassword: Joi.string().required().min(6),
    ConfirmNewPassword: Joi.ref("NewPassword"),
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
  validateAdminLogin,
  ImageUpload,
  validateProfile
};
