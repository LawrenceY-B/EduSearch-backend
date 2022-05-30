const User = require("../models/user");
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
    sendSMS(req.body.Phoneumber, text)

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
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    const phone = req.body.Phonenumber.replace(
      req.body.Phonenumber.slice(0, 1),
      "233"
    );
    const result = await User.find({ Phonenumber: phone });
    if (result < 1) {
      return res.status(401).json({ message: "Invalid Phonenumber" });
    }
    await bcrypt.compare(
      req.body.Password,
      result[0].Password,
      (err, outcome) => {
        if (err) {
          return res.status(401).json({ message: "Login failed" });
        }
        if (outcome) {
          const token = jwt.sign(
            {
              id: result[0]._id.toString(),
              Phonenumber: result[0].Phonenumber,
            },
            "somecrazylongGhanasoftlife",
            { expiresIn: "600s" }
          );

          return res.status(201).json({
            success: true,
            message: "Auth succesful",
            token: token,
            userID: result[0]._id.toString(),
          });
        }
      }
    );
    const OTP = await generateOTP(phone);
    const text = `Your one-time password to activate your account is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;
    sendSMS(phone, text)
    console.log(text);
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
    //verify the nymber
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
          message: "The number is succesfully verified",
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
const resendOTP = async (req, res) =>{
  try {
      const phone= req.body.Phonenumber
      if(!phone)  return res.status(400).json({ success: false, message: "Missing arguments"})
      const Otp = await generateOTP(number)
      const text = `Your one-time password to activate your account is ${Otp}.\n\nThis password will expire in 10 minutes.\n\n`
      sendSMS(phone, text)
      return res.status(201).json({ success: true, otp: Otp })
  } catch (error) {
      console.log(error)        
      return res.status(400).json({ success: false, message: 'Sorry, something went wrong' });        
  }
}
const logout = (req, res) => {};
const forgotPassword = (req, res) => {};
const changePassword = (req, res) => {};
module.exports = {
  AddNewUser,
  login,
  logout,
  forgotPassword,
  changePassword,
  verifyNumber,
  resendOTP
};
