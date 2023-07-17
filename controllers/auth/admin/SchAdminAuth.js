const Admin = require("../../../models/SchoolAdmin");
require("dotenv").config();
const tokenkey = process.env.TOKEN_KEY;
const bcrypt = require("bcrypt");
const {
  validateAdmin,
  validateAdminLogin,
  generateOTP,
  verifyOTP,
  validateOTP,
  sendSMS,
  validatePassword,
  validatePhoneNumber,
} = require("../../../services/auth.service");
const jwt = require("jsonwebtoken");
//Creating a new user
const AdminAddNewUser = async (req, res) => {
  try {
    const { error } = validateAdmin(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    let { name, email, password, phone, role } = req.body;
    password = await bcrypt.hash(password, 8);
    phone = phone.replace(phone.slice(0, 1), "233");
    const user = await Admin.find({ phone: phone });
    if (user.length === 1)
      return res
        .status(403)
        .json({ success: false, message: "Phone already in use" });

    const result = await Admin.create({
      name: name,
      email: email,
      password: password,
      phone: phone,
      isVerified: false,
      role: role,
    });

    //generate otp
    const OTP = await generateOTP(phone);
    const text = `Your one-time password to activate your account is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;

    //send otp
    sendSMS(phone, text)
    //error handling
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
// work on login and other functions

const Adminlogin = async (req, res) => {
  try {
    const { error } = validateAdminLogin(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const { phone, password } = req.body;
    let Phonenumber = phone.replace(phone.slice(0, 1), "233");
    const user = await Admin.findOne({ phone: Phonenumber });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified === false) {
      return res
        .status(403)
        .json({ success: false, message: "Number has not been verified" });
    }
    bcrypt.compare(password, user.password, (error, outcome) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
      }
      if (outcome) {
        const token = jwt.sign(
          { AdminEmail: user.email, AdminId: user._id, AdminRole: user.role },
          `${tokenkey}`,
          {
            expiresIn: "4h",
          }
        );
        user.token = token;
        user.save();
        const text = `You have succesfully logged in`;
        sendSMS(phone, text);
        return res.status(201).json({
          success: true,
          login_message: text,
          message: "Authentication successful",
          // userID: user._id.toString(),
          token: token,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Passwords do not match" });
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
//test and see if changes the value on the db
const AdminverifyNumber = async (req, res) => {
  try {
    const { error } = validateOTP(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { Phonenumber, otp } = req.body;
    //work on this area tonight
    const Phone = Phonenumber.replace(Phonenumber.slice(0, 1), "233");

    //check if user exists
    const result = await Admin.findOne({ phone: Phone });
    if (!result) {
      return res.status(401).json({ message: "No User found" });
    }

    //check otp status
    const verify = await verifyOTP(Phone, otp);
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
      result.isVerified = true;
      result.save();

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
      .status(500)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};
//resend otp
const AdminresendOTP = async (req, res) => {
  try {
    let phone = req.body.Phonenumber;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Missing arguments" });
    phone = phone.replace(req.body.Phonenumber.slice(0, 1), "233");

    const Otp = await generateOTP(phone);
    const text = `Your one-time password to activate your account is ${Otp}.\n\nThis password will expire in 10 minutes.\n\n`;
    sendSMS(phone, text);
    return res.status(201).json({ success: true, otp: Otp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};
//logout
const Adminlogout = async (req, res) => {
  try {
    const fullheader = req.headers.authorization;
    const token = fullheader.split(" ")[1];
    if (!token) {
      return res.status(401).json("Unauthorized");
    }
    await jwt.verify(token, `${tokenkey}`, (err, decoded) => {
      if (err) {
        return res.status(500).send("Server error");
      }

      const payload = {
        sub: decoded.sub,
        iat: Date.now() / 1000,
        exp: 0,
      };

      const newToken = jwt.sign(payload, `${tokenkey}`);
      // Respond with a success message and the new token
      return res.status(200).json({ message: "Logged out", token: newToken });
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};
//reset password
const AdminresetPassword = async (req, res) => {
  try {
    const password = req.body;
    const { error } = await validatePassword(password);
    if (error) return res.status(400).json({ message: error.message });

    const AdminDetail = extractMail(req, res);
    const UserMail = AdminDetail.AdminEmail;
    const existinguser = await Admin.findOne({ email: UserMail });
    if (!existinguser) {
      res.status(401).json({ message: "Couldn't find user" });
    } else {
      const HashedPassword = await bcrypt.hash(password.NewPassword, 8);
      const Mail = { email: UserMail };
      const update = { password: HashedPassword };
      let updatePass = await Admin.findOneAndUpdate(Mail, update, {
        new: true,
      });
      if (!updatePass) {
        res.status(401).json({ message: "something went wrong" });
      } else {
        res.status(201).json({ message: "Passwords updated successfully" });
        // console.log(updatePass);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//work on forgot password logic
const AdminforgotPassword = async (req, res) => {
  try {
    let phone = req.body;
    // console.log(phone);
    const { error } = validatePhoneNumber(phone);
    if (error) return res.status(400).json({ message: error.message });
    phone = req.body.Phonenumber.replace(
      req.body.Phonenumber.slice(0, 1),
      "233"
    );
    const OTP = await generateOTP(phone);
    // const hashedOTP = await bcrypt.hash(OTP, 8);
    const result = await Admin.findOne({ phone: phone });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Phonenumber does not exist" });
    } else {
      const text = `Enter this code ${OTP} to reset password`;
      sendSMS(phone,text)
      return res
        .status(202)
        .json({ success: true, message: `Enter your ${OTP} in the stage` });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `We're working on this` });
  }
};
const Adminverifyreset = async (req, res) => {
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
    const result = await Admin.findOne({ phone: phone });
    if (!result) {
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
      const token = jwt.sign({ AdminEmail: result.email }, `${tokenkey}`, {
        expiresIn: 900,
      });
      console.log(result.email);
      return res.status(200).json({
        success: true,
        token: token,
        message: "The number has been succesfully verified",
        // userEmail: result.mail,
      });
    }
    return res.status(400).json({
      success: false,
      message: "You used the wrong OTP. Check and try again/error",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};

module.exports = {
  AdminAddNewUser,
  Adminlogin,
  Adminlogout,
  AdminforgotPassword,
  AdminverifyNumber,
  AdminresendOTP,
  AdminresetPassword,
  Adminverifyreset,
};
//code for uploading images using multer to an aws s3 bucket
