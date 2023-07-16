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
  getUserData,
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
} = require("../controllers/auth/admin/SchAdminAuth");

const{
UniAdminAddNewUser,
UniAdminlogin,
UniAdminlogout,
UniAdminforgotPassword,
UniAdminverifyNumber,
UniAdminresendOTP,
UniAdminresetPassword,
UniAdminverifyreset,
}=require("../controllers/auth/admin/UniAdminAuth")
const { verifyToken, verifyResetToken, verifySchAdmin,verifyUniAdmin } = require("../middleware/isAuth");
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
router.get("/getprofile", verifyToken, getUserData);

// School Admin Authentication
router.post("/Schooladmin/signup", AdminAddNewUser);
router.post("/Schooladmin/login", Adminlogin);
router.post("/Schooladmin/verifynumber", AdminverifyNumber);
router.post("/Schooladmin/resendotp", AdminresendOTP);
router.get("/Schooladmin/logout", verifySchAdmin, Adminlogout);
router.post("/Schooladmin/forgotpass", AdminforgotPassword);
router.post("/Schooladmin/verifyresetotp", Adminverifyreset);
router.post("/Schooladmin/resetpass", verifyResetToken, AdminresetPassword);
// University Admin Authentication
router.post("/Uniadmin/signup", UniAdminAddNewUser);
router.post("/Uniadmin/login", UniAdminlogin);
router.post("/Uniadmin/verifynumber", UniAdminverifyNumber);
router.post("/Uniadmin/resendotp", UniAdminresendOTP);
router.get("/Uniadmin/logout", verifyUniAdmin, UniAdminlogout);
router.post("/Uniadmin/forgotpass", UniAdminforgotPassword);
router.post("/Uniadmin/verifyresetotp", UniAdminverifyreset);
router.post("/Uniadmin/resetpass", verifyResetToken, UniAdminresetPassword);
module.exports = router;
