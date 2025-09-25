// Update student (admin: all, collegeadmin: same department, professor: same department and branch)
async function updateStudent(req, res) {
  try {
    const { studentId, enrollmentNumber, department, branch, year, email, firstName, lastName } = req.body;
    if (!studentId) {
      return res.status(400).json({ status: 'fail', message: 'studentId is required' });
    }
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }
    // Role-based permission check
    const user = req.user;
    if (user.role === 'admin') {
      // admin can update all students
    } else if (user.role === 'collegeadmin') {
      if (student.department !== user.department) {
        return res.status(403).json({ status: 'fail', message: 'No permission to update this student.' });
      }
    } else if (user.role === 'professor') {
      if (student.department !== user.department || student.branch !== user.branch) {
        return res.status(403).json({ status: 'fail', message: 'No permission to update this student.' });
      }
    } else {
      return res.status(403).json({ status: 'fail', message: 'No permission to update students.' });
    }
    // Update fields
    if (enrollmentNumber !== undefined) student.enrollmentNumber = enrollmentNumber;
    if (department !== undefined) student.department = department;
    if (branch !== undefined) student.branch = branch;
    if (year !== undefined) student.year = year;
    if (email !== undefined) student.email = email;
    if (firstName !== undefined) student.firstName = firstName;
    if (lastName !== undefined) student.lastName = lastName;
    await student.save();
    res.status(200).json({ status: 'success', message: 'Student updated' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}
const { User } = require("../models/user");


// Delete college admin (now just delete user with role collegeadmin)
async function deleteCollegeAdmin(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ status: 'fail', message: 'userId is required' });
    }
    const user = await User.findById(userId);
    if (!user || user.role !== 'collegeadmin') {
      return res.status(404).json({ status: 'fail', message: 'College admin not found' });
    }
    await User.findByIdAndDelete(userId);
    logAdminAction(req.user._id, 'DELETE_COLLEGE_ADMIN', { userId });
    res.status(200).json({ status: 'success', message: 'College admin deleted' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}








// Get all students (for CollegeAdmin/Professor)
async function getAllStudents(req, res) {
  try {
    let students;
    if (req.user.role === 'collegeadmin') {
      // College admin: only view students in their department
      students = await User.find({ role: 'student', department: req.user.department });
    } else {
      // Professor/admin: view all students
      students = await User.find({ role: 'student' });
    }
    res.status(200).json({
      status: "success",
      data: { students },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
}

// Get unapproved students (User model only)
async function getUnapprovedStudents(req, res) {
  try {
    const students = await User.find({ role: 'student', isApproved: false });
    res.status(200).json({
      status: "success",
      data: { students },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
}

// Update user (admin only, all fields in User model)
const bcrypt = require('bcryptjs');
async function updateUser(req, res) {
  try {
    console.log('updateUser req.body:', req.body);
    const { userId, email, role, department, branch, collegeName, firstName, lastName, enrollmentNumber, year, startYear, endYear, degree, rollNumber, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof department !== 'undefined') user.department = department;
    if (typeof branch !== 'undefined') user.branch = branch;
    if (typeof collegeName !== 'undefined') user.collegeName = collegeName;
    if (typeof firstName !== 'undefined') user.firstName = firstName;
    if (typeof lastName !== 'undefined') user.lastName = lastName;
    if (typeof enrollmentNumber !== 'undefined') user.enrollmentNumber = enrollmentNumber;
    if (typeof year !== 'undefined') user.year = year;
    if (typeof startYear !== 'undefined') user.startYear = startYear;
    if (typeof endYear !== 'undefined') user.endYear = endYear;
    if (typeof degree !== 'undefined') user.degree = degree;
    if (typeof rollNumber !== 'undefined') user.rollNumber = rollNumber;
    if (typeof password !== 'undefined' && password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    logAdminAction(req.user._id, 'UPDATE_USER', { userId, email, role, department, branch });
    res.status(200).json({ status: 'success', message: 'User updated' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}

// Approve student (User model only)
async function approveStudent(req, res) {
  try {
    const { studentId } = req.body;
    // Only admin, collegeadmin, or professor can approve students
    if (!(req.user.role === 'admin' || req.user.role === 'collegeadmin' || req.user.role === 'professor')) {
      return res.status(403).json({ status: 'fail', message: 'Only admin, collegeadmin, or professor can approve students.' });
    }
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }
    student.isApproved = true;
    await student.save();
    logAdminAction(req.user._id, 'APPROVE_STUDENT', { studentId });
    res.status(200).json({ status: 'success', message: 'Student approved' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}

// Delete student (User model only)
async function deleteStudent(req, res) {
  try {
    const { studentId } = req.body;
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ status: 'fail', message: 'Student not found' });
    }
    // Prevent deleting admin user (should never happen, but for safety)
    if (student.role === 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Cannot delete admin user.' });
    }
    await User.findByIdAndDelete(studentId);
    logAdminAction(req.user._id, 'DELETE_STUDENT', { studentId });
    res.status(200).json({ status: 'success', message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}

// Function to fetch all users
async function getAllUsers(req, res) {
  try {
    let users;
    if (req.user.role === 'admin') {
      // Admin: all collegeadmins, professors, alumni
      users = await User.find({ role: { $in: ['collegeadmin', 'professor', 'alumni'] } });
    } else if (req.user.role === 'collegeadmin') {
      // College admin: professors and alumni of same department
      users = await User.find({
        role: { $in: ['professor', 'alumni'] },
        department: req.user.department
      });
    } else if (req.user.role === 'professor') {
      // Professor: alumni of same department and branch
      users = await User.find({
        role: 'alumni',
        department: req.user.department,
        branch: req.user.branch
      });
    } else {
      users = [];
    }
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Error during fetching all users:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
}


const fs = require('fs');
const path = require('path');

// Audit log helper
function logAdminAction(adminId, action, details) {
  const logPath = path.join(__dirname, '../../admin_audit.log');
  const logEntry = `${new Date().toISOString()} | Admin: ${adminId} | Action: ${action} | Details: ${JSON.stringify(details)}\n`;
  fs.appendFileSync(logPath, logEntry);
}

// Approve user (collegeadmin, professor, alumni)
async function approveUser(req, res) {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    // Only admin can approve collegeadmin
    if (user.role === 'collegeadmin' && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Only admin can approve college admins.' });
    }
    // Only admin or collegeadmin can approve professor or alumni
    if ((user.role === 'professor' || user.role === 'alumni') && !(req.user.role === 'admin' || req.user.role === 'collegeadmin')) {
      return res.status(403).json({ status: 'fail', message: 'Only admin or collegeadmin can approve professors or alumni.' });
    }
    user.isApproved = true;
    await user.save();
    logAdminAction(req.user._id, 'APPROVE_USER', { userId });
    res.status(200).json({ status: 'success', message: 'User approved' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
}

module.exports = {
  getAllUsers,
  approveUser,
  getAllStudents,
  getUnapprovedStudents,
  approveStudent,
  deleteStudent,
  updateUser,
  deleteCollegeAdmin,
  updateStudent,
};
