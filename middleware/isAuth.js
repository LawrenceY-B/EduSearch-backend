const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const tokenkey = process.env.TOKEN_KEY;

const verifyToken = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Invalid Authorization header");
  }
  const token = authHeader.split(" ")[1];
  try {
    let decodedToken = jwt.verify(token, `${tokenkey}`);
    if (!decodedToken) {
      const error = new Error("Not Authorized");
      res.status(400).json(error);
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(400).json({ message: "something went wrong" });
    console.log(error);
  }
};
const verifyResetToken = async (req, res, next) => {
  const authHeader = req.get("Reset-Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  try {
    let decodedToken = jwt.verify(token, `${tokenkey}`);
    if (!decodedToken) {
      const error = new Error("Not Authorized");
      res.status(400).json({ message: `${error}` });
    }
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(400).json({ message: "something went wrong" });
    console.log(error);
  }
};
const verifySchAdmin = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log(decoded);
    if (decoded.AdminRole !== "SchoolAdmin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    }
    req.AdminRole = decoded.AdminRole;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "something went wrong" });
    // console.log(error);
  }
};
const verifyUniAdmin = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log(decoded);
    if (decoded.AdminRole !== "UniversityAdmin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    }
    req.AdminRole = decoded.AdminRole;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "something went wrong" });
    // console.log(error);
  }
};
module.exports = {
  verifyToken,
  verifyResetToken,
  verifySchAdmin,
  verifyUniAdmin,
};
