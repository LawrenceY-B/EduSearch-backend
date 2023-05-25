const express = require("express");
const {
  AddNewUser,
  login,
  logout,
  verifyNumber,
  forgotPassword,
  resendOTP,
  resetPassword,
  verifyreset,
} = require("../controllers/auth/user/UserAuth");
const {
  AdminAddNewUser,
  Adminlogin,
  Adminlogout,
  AdminforgotPassword,
  AdminverifyNumber,
  AdminresendOTP,
  AdminresetPassword,
  Adminverifyreset,
} = require("../controllers/auth/admin/AdminAuth");

const { verifyToken, verifyResetToken } = require("../middleware/isAuth");
const router = express.Router();
//user Authentication
router.post("/signup", AddNewUser);
router.post("/login", login);
router.post("/verifynumber", verifyNumber);
router.post("/resendotp", resendOTP);
router.get("/logout", verifyToken, logout);
router.post("/forgotpass", forgotPassword);
router.post("/verifyresetotp", verifyreset);
router.post("/resetpass", verifyResetToken, resetPassword);

//Admin Authentication
router.post("/admin/signup", AdminAddNewUser);
router.post("/admin/login", Adminlogin);
router.post("/admin/verifynumber", AdminverifyNumber);
router.post("/admin/resendotp", resendOTP);
router.get("/admin/logout", verifyToken, logout);
router.post("/admin/forgotpass", forgotPassword);
router.post("/admin/verifyresetotp", verifyreset);
router.post("/admin/resetpass", verifyResetToken, resetPassword);

module.exports = router;
