
const { User } = require("../models/user");
const bcrypt = require('bcryptjs');

const registerController = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, department, branch, enrollmentNumber, year, startYear, endYear, degree, rollNumber, collegeName } = req.body;
    // Basic validation
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({ status: "fail", message: "Email, password, role, firstName, and lastName are required." });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ status: "fail", message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res.status(400).json({ status: "fail", message: "Password must be at least 6 characters." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "fail", message: "Email is already registered. Please use a different email." });
    }
    // Role-specific required fields
    if (role === "student") {
      if (!enrollmentNumber || !department || !branch || !year) {
        return res.status(400).json({ status: "fail", message: "enrollmentNumber, department, branch, and year are required for students." });
      }
    } else if (role === "alumni") {
      if (!startYear || !endYear || !degree || !department || !branch || !rollNumber) {
        return res.status(400).json({ status: "fail", message: "startYear, endYear, degree, department, branch, and rollNumber are required for alumni." });
      }
    } else if (role === "professor") {
      if (!department) {
        return res.status(400).json({ status: "fail", message: "department is required for professors." });
      }
    } else if (role === "collegeadmin") {
      if (!department) {
        return res.status(400).json({ status: "fail", message: "department is required for college admins." });
      }
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ status: "fail", message: "Only admin can register college admins." });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      department,
      branch,
      enrollmentNumber,
      year,
      startYear,
      endYear,
      degree,
      rollNumber,
      collegeName,
  isApproved: role === 'admin' ? true : false
    };
    const newUser = await User.create(userData);
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = registerController;



