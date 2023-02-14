const User = require("../models/user");
const Fpass = require("../models/forgotpass");
const bcrypt = require("bcrypt");
const {
  validateUser,
  validateLogin,
  generateOTP,
  verifyOTP,
  validateOTP,
  sendSMS
} = require("./services");
const jwt = require("jsonwebtoken");

const AddNewUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const password = await bcrypt.hash(req.body.Password, 8);
    const phone = req.body.Phonenumber.replace(
      req.body.Phonenumber.slice(0, 1),
      "233"
    );
    const Email = req.body.Email;
    const u = await User.find({ Phonenumber: phone });
    if (u.length === 1)
      return res
        .status(403)
        .json({ success: false, message: "Phone already in use" });
    const result = User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: password,
      Phonenumber: phone,
      Email: Email,
    });
    const OTP = await generateOTP(phone);
    const text = `Your one-time password to activate your account is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;
    sendSMS(phone, text)

    if (result)
      return res.status(201).json({
        success: true,
        message: "Account has been created",
        otp: `${text}`,
      });
    return res
      .status(400)
      .json({ success: false, message: "Couldn't add user details" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });
  }
};
const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const phone = req.body.Phonenumber.replace(
      req.body.Phonenumber.slice(0, 1),
      "233"
    );
    const result = await User.find({ Phonenumber: phone });
    if (result < 1) {
      return res.status(401).json({ message: "Invalid Phonenumber" });
    } else { console.log('This works') }
    // const OTP = await generateOTP(phone);
    bcrypt.compare(
      req.body.Password, result[0].Password, (Error, outcome) => {
        if (Error) {
          return res.status(401).json({ message: "Something went wrong" });
        }
        if (outcome) {
          // const text = `Your one-time password to activate your account is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;
          // sendSMS(phone, text);
          // console.log(text);
          const text = `You have succesfully logged in`
          // sendSMS(phone, text);
          return res.status(201).json({
            success: true,
            login: text,
            message: "Auth succesful",
            // token: token,
            userID: result[0]._id.toString(),
          });
        } else {
          return res.json({ success: false, message: 'Passwords do not match' });
        }
      })
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });
  }
};
const verifyNumber = async (req, res) => {
  try {
    const { error } = validateOTP(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const phone = req.body.Phonenumber.replace(
      req.body.Phonenumber.slice(0, 1),
      "233"
    );
    const otp = req.body.otp;
    //check if both values are present
    if (!phone || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Missing arguments" });
    //check if user exists
    const result = await User.find({ Phonenumber: phone });
    if (result < 1) {
      return res.status(401).json({ message: "No User found" });
    }
    //verify the number
    const verify = await verifyOTP(phone, otp);
    if (verify === "wrong")
      return res.status(400).json({
        success: false,
        message: "You used the wrong OTP. Check and try again",
      });
    else if (verify === "expired")
      return res.status(400).json({
        success: false,
        message: "You used an expired OTP. Please generate a new one",
      });
    else if (verify === "valid") {
      return res
        .status(200)
        .json({
          success: true,
          message: "The number has been succesfully verified",
        });
    }
    return res
      .status(400)
      .json({
        success: false,
        message: "You used the wrong OTP. Check and try again/error",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};
const resendOTP = async (req, res) => {
  try {
    const phone = req.body.Phonenumber
    if (!phone) return res.status(400).json({ success: false, message: "Missing arguments" })
    const Otp = await generateOTP(number)
    const text = `Your one-time password to activate your account is ${Otp}.\n\nThis password will expire in 10 minutes.\n\n`
    sendSMS(phone, text)
    return res.status(201).json({ success: true, otp: Otp })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'Sorry, something went wrong' });
  }
}
const logout = (req, res) => { };
const resetPassword = async (req, res) => {
  // const { otp, newpass } = req.body
  // try {
  //   const hashedOtp = await bcrypt.hash(otp, 8);
  //   if (!otp || !newpass) return res.status(401).json({ success: false, message: "missing argument" })
  
  //   bcrypt.compare(req.body.otp, result.otp, (Error, outcome) => {
  //     if (Error) {
  //       return res.status(401).json({ message: "Something went wrong" });
  //     }
  //     if (outcome) {
  //       console.log('small progrss')
  //     }
  //   })

  // } catch (error) {
  //   console.log(error)
  //   return res.status(400).json({ success: false, message: `We're working on this` })
  // }
}
const forgotPassword = async (req, res) => {

  try {
    const phone = req.body.Phonenumber.replace(
      req.body.Phonenumber.slice(0, 1),
      "233"
    );
    const OTP = await generateOTP(phone);
    const hashedOtp = await bcrypt.hash(OTP, 8);
    if (!phone) return res.status(400).json({ success: false, message: "Missing arguments" })
    const result = await User.find({ Phonenumber: phone });
    if (result.length === 1) {
      const text = `Enter this code ${OTP} to reset password`
      // sendSMS(phone,text)
      await Fpass.create({ number: phone, otp: hashedOtp })
      return res
        .status(302)
        .json({ success: true, message: `Enter your ${OTP}` })
    } else {
      return res.status(400).json({ success: false, message: "Phonenumber does not exist" })
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: `We're working on this` })
  }
};

module.exports = {
  AddNewUser,
  login,
  logout,
  forgotPassword,
  verifyNumber,
  resendOTP,
  resetPassword
};
