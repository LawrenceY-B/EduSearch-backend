const User = require("../../../models/user");
require("dotenv").config();
const tokenkey = process.env.TOKEN_KEY;
const {
  extractResetMail,
  extractMail,
} = require("../../../services/school.service");
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
  ImageUpload,
  validateProfile,
} = require("../../../services/auth.service");
const jwt = require("jsonwebtoken");
//Creating a new user
const AddNewUser = async (req, res, next) => {
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
      ImgUrl: `${process.env.DEFAULT_IMGURL}`,
    });

    //generate otp
    const OTP = await generateOTP(phone);
    const text = `Your EduSearch verification code is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;

    //send otp
    sendSMS(phone, text);
    //error handling
    if (result)
      return res.status(201).json({
        success: true,
        message: `Account has been created ${OTP}`,
        otp: OTP,
      });
    return res
      .status(400)
      .json({ success: false, message: "Couldn't add user details" });
  } catch (error) {
    next(error);
  }
};
//login an existing user
const login = async (req, res, next) => {
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
      const OTP = await generateOTP(phone);
      const text = `Your EduSearch verification code is ${OTP}.\n\nThis password will expire in 5 minutes.\n\n`;
      sendSMS(phone, text);
      return res
        .status(403)
        .json({ success: false, message: "Please verify number", text: text });
    }
    bcrypt.compare(req.body.Password, user.Password, (error, outcome) => {
      if (error) {
        next(error);
      }
      if (outcome) {
        /**Add new token**/
        const token = jwt.sign(
          { userEmail: user.Email, userId: user._id, phone: user.Phonenumber },
          `${tokenkey}`,
          {
            expiresIn: "12h",
          }
        );
        user.token = token;
        user.save();
        const text = `You have succesfully logged in`;
        return res.status(201).json({
          success: true,
          login_message: text,
          message: "Authentication successful",
          token: token,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Passwords do not match" });
      }
    });
  } catch (error) {
    next(error);
  }
};
//TO_DO change phone number to email
//test and see if changes the value on the db
const verifyNumber = async (req, res, next) => {
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
    next(error);
  }
};
//resend otp
const resendOTP = async (req, res, next) => {
  try {
    let phone = req.body.Phonenumber;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Missing arguments" });
    phone = phone.replace(req.body.Phonenumber.slice(0, 1), "233");

    const Otp = await generateOTP(phone);
    const text = `Your EduSearch verification code is ${Otp}.\n\nThis password will expire in 10 minutes.\n\n`;
    sendSMS(phone, text);
    return res.status(201).json({
      success: true,
      message: "A new OTP has been sent to your number",
      otp: Otp,
    });
  } catch (error) {
    next(error);
  }
};
//logout
const logout = async (req, res, next) => {
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
    next(error);
  }
};
//reset password
const resetPassword = async (req, res, next) => {
  try {
    const password = req.body;
    const { error } = await validatePassword(password);
    if (error) return res.status(400).json({ message: error.message });

    const Userdetail = extractResetMail(req, res);
    const UserMail = Userdetail.userEmail;

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
      }
    }
  } catch (error) {
    next(error);
  }
};
//work on forgot password logic
const forgotPassword = async (req, res, next) => {
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
      sendSMS(phone, text);
      return res.status(202).json({
        success: true,
        message: `A short code has been sent to you`,
        otp: OTP,
      });
    }
  } catch (error) {
    next(error);
  }
};
const verifyreset = async (req, res, next) => {
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
    next(error);
  }
};
const getUserData = async (req, res, next) => {
  try {
    const userdetail = extractMail(req, res);
    const userNumber = userdetail.phone;
    const result = await User.findOne({ Phonenumber: userNumber }).select(
      "-Password -FavoriteSchools"
    );
    if (!result) {
      return res.status(401).json({ message: "No User found" });
    }
    return res.status(200).json({ message: "User found", data: result });
  } catch (error) {
    next(error);
  }
};
const editProfile = async (req, res, next) => {
  try {
    //extractmail from token to verify user is logged in
    const userdetail = extractMail(req, res);
    const usermail = userdetail.userEmail;
    const userID=userdetail.userId
    //validate user query
    const { error } = validateProfile(req.body);
    if (error) return res.status(409).json({ message: error.message });
    const { Name, Phonenumber, Email } = req.body;
    const phone = Phonenumber.replace(Phonenumber.slice(0, 1), "233");
    const image = req.file;
    //upload image to S3 bucket
    let ImgUrl
    if(image){
      const link = await ImageUpload(image,next,userID);
      ImgUrl = link
    }
    
    console.log(ImgUrl);
    const Mail = { Email: usermail };
    const update = {
      Name: Name,
      Phonenumber: phone,
      Email: Email,
      ImgUrl: ImgUrl,
    };
    const user = await User.findOneAndUpdate(Mail, update, { new: true }).select(
      "-Password -FavoriteSchools"
    );;
    //generate new token with the new email
    const token = jwt.sign(
      { userEmail: user.Email, userId: user._id, phone: user.Phonenumber },
      `${tokenkey}`,
      {
        expiresIn: "12h",
      }
    );
    
    if (!user) {
      return res.status(401).json({ message: "User not authorized" });
    }
    return res.status(200).json({ message: "User updated", data: user, token: token });
  } catch (error) {
   next(error)
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
  getUserData,
  editProfile,
};
