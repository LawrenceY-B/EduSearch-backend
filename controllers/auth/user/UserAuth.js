const User = require("../../../models/user");
const Fpass = require("../../../models/forgotpass");
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
  validatePassword,
  validatePhoneNumber,
} = require("../../../services/auth.service");
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
      
      Name: req.body.Name,
      Password: password,
      Phonenumber: phone,
      Email: Email,
      isVerified: false,
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
        otp: OTP,
      });
    return res
      .status(400)
      .json({ success: false, message: "Couldn't add user details" });
  } catch (error) {
    // console.log(error);
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
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (user.isVerified === false) {
      return res
        .status(403)
        .json({ success: false, message: "Number has not been verified" });
    }
    bcrypt.compare(req.body.Password, user.Password, (error, outcome) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
      }
      if (outcome) {
        /**Add new token**/
        const token = jwt.sign(
          { userEmail: user.Email, userId: user._id, },
          `${tokenkey}`,
          {
            expiresIn: "4h",
          }
        );
        user.token = token;
        user.save();
        const text = `You have succesfully logged in`;
        // sendSMS(phone, text);
        return res.status(201).json({
          success: true,
          login_message: text,
          message: "Authentication successful",
          userID: user._id.toString(),
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
    const result = await User.findOne({ Phonenumber: phone });
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
     result.isVerified=true;
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
const resendOTP = async (req, res) => {
  try {
    let phone = req.body.Phonenumber;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Missing arguments" });
    phone = phone.replace(req.body.Phonenumber.slice(0, 1), "233");

    const Otp = await generateOTP(phone);
    const text = `Your one-time password to activate your account is ${Otp}.\n\nThis password will expire in 10 minutes.\n\n`;
    // sendSMS(phone, text);
    return res.status(201).json({ success: true, otp: Otp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Sorry, something went wrong" });
  }
};
//logout
const logout = async (req, res) => {
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
const resetPassword = async (req, res) => {
  try {
    const password = req.body;
    const { error } = await validatePassword(password);
    if (error) return res.status(400).json({ message: error.message });

    const UserMail = req.get("UserMail");
    if (!UserMail) {
      res.status(401).json({ message: "Not authorized" });
    }

    const updatePass = await User.findOne({ Email: UserMail });
    if (!updatePass) {
      res.status(401).json({ message: "Couldn't find user" });
    } else {
      const HashedPassword = await bcrypt.hash(password.NewPassword, 8);

      const Mail = { Email: UserMail };
      const update = { Password: HashedPassword };
      let updatePass = await User.findOneAndUpdate(Mail, update, { new: true });
      if (!updatePass) {
        res.status(401).json({ message: "something went wrong" });
      } else {
        res.status(201).json({ message: "Passwords updated successfully" });
        console.log(updatePass);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//work on forgot password logic
const forgotPassword = async (req, res) => {
  try {
    let phone = req.body;
    const { error } = validatePhoneNumber(phone);
    if (error) return res.status(400).json({ message: error.message });
    phone = phone.Phonenumber.replace(req.body.Phonenumber.slice(0, 1), "233");
    const OTP = await generateOTP(phone);
    const hashedOTP = await bcrypt.hash(OTP, 8);
    const result = await User.findOne({ Phonenumber: phone });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Phonenumber does not exist" });
    } else {
      const text = `Enter this code ${OTP} to reset password`;
      // sendSMS(phone,text)
      await Fpass.create({ number: phone, otp: hashedOTP });
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
const verifyreset = async (req, res) => {
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
      const token = jwt.sign({ userEmail: result.Email }, `${tokenkey}`, {
        expiresIn: 900,
      });
      return res.status(200).json({
        success: true,
        token: token,
        message: "The number has been succesfully verified",
        userEmail: result.Email,
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
  AddNewUser,
  login,
  logout,
  forgotPassword,
  verifyNumber,
  resendOTP,
  resetPassword,
  verifyreset,
};
// const {error}= await validateNumber(phone);
// if (error) res.status(400).json({error: error.message});
// const validatedPhoneNumber = req.body.Phonenumber.replace(
//   req.body.Phonenumber.slice(0, 1),
//   "233"
// );

// const OTP = await generateOTP(validatedPhoneNumber);
// const hashedOtp = await bcrypt.hash(OTP, 8);
