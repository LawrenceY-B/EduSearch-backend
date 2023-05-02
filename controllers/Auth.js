const User = require("../models/user");
const Fpass = require("../models/forgotpass");
require("dotenv").config();
const tokenkey = process.env.TOKEN_KEY;
const bcrypt = require("bcrypt");
const {
  validateUser,
  validateLogin,
  generateOTP,
  verifyOTP,
  validateOTP,
  sendSMS,
  validatePhoneNumber,
} = require("../services/auth.service");
const jwt = require("jsonwebtoken");
//Creating a new user
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
    const result = await User.create({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Password: password,
      Phonenumber: phone,
      Email: Email,
    });

    //generate otp
    const OTP = await generateOTP(phone);
    const text = `Your one-time password to activate your account is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;

    //send otp
    // sendSMS(phone, text)
    //error handling
    if (result)
      return res.status(201).json({
        success: true,
        message: "Account has been created",
        ref: `${phone}`,
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
//login an existing user
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
    const user = await User.findOne({ Phonenumber: phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid Phonenumber" });
    }
    bcrypt.compare(req.body.Password, user.Password, (Error, outcome) => {
      if (Error) {
        return res.status(401).json({ message: "Something went wrong" });
      }
      if (outcome) {
        /**Add new token**/
        const token = jwt.sign({ userId: user._id.toString() }, `${tokenkey}`, {
          expiresIn: "2h",
        });
        user.token = token;
        const text = `You have succesfully logged in`;
        // sendSMS(phone, text);
        return res.status(201).json({
          success: true,
          login_message: text,
          message: "Auth succesful",
          userID: user._id.toString(),
          token: token,
        });
      } else {
        return res.json({ success: false, message: "Passwords do not match" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Something went wrong" });
  }
};
//TO_DO change phone number to email
//verify otp
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
    //check otp status
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
      return res.status(200).json({
        success: true,
        message: "The number has been succesfully verified",
      });
    }
    return res.status(400).json({
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
//resend otp
const resendOTP = async (req, res) => {
  try {
    const phone = req.body.Phonenumber;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Missing arguments" });
    const Otp = await generateOTP(number);
    const text = `Your one-time password to activate your account is ${Otp}.\n\nThis password will expire in 10 minutes.\n\n`;
    sendSMS(phone, text);
    return res.status(201).json({ success: true, otp: Otp });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};
//logout
const logout = (req, res) => {};
//reset password
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
};
//work on forgot password logic
const forgotPassword = async (req, res) => {
  try {
    const phone = req.body.Phonenumber;
    const validatedPhoneNumber = validatePhoneNumber(phone);
    console.log(validatedPhoneNumber);
    if (!validatedPhoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Missing arguments" });
    }

    const OTP = await generateOTP(validatedPhoneNumber);
    const hashedOtp = await bcrypt.hash(OTP, 8);
    const result = await User.findOne({ Phonenumber: validatedPhoneNumber });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Phonenumber does not exist" });
    } else {
      const text = `Enter this code ${OTP} to reset password`;
      // sendSMS(phone,text)
      await Fpass.create({ number: validatedPhoneNumber, otp: hashedOtp });
      return res
        .status(302)
        .json({ success: true, message: `Enter your ${OTP}` });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: `We're working on this` });
  }
};

module.exports = {
  AddNewUser,
  login,
  logout,
  forgotPassword,
  verifyNumber,
  resendOTP,
  resetPassword,
};
