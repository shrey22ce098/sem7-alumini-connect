
const { updateStudent } = require('../controllers/userController');

const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/checkAuth'); // <-- this must come first!
const { deleteCollegeAdmin } = require('../controllers/userController');


const {
  getAllUsers,
  // getUnapprovedAlumni, (removed, not implemented)
  approveUser,
  getAllStudents,
  getUnapprovedStudents,
  approveStudent,
  deleteStudent,
  updateUser,
} = require('../controllers/userController');
// Update user (admin only)
router.put('/update', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'collegeadmin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin or collegeadmin can update users.'
    });
  }
  next();
}, updateUser);
const registerController = require('../controllers/registerController');

// Student management (CollegeAdmin/Professor)
router.get('/students/all', checkAuth, (req, res, next) => {
  if (!(req.user.role === 'collegeadmin' || req.user.role === 'professor' || req.user.role === 'admin')) {
    return res.status(403).json({ status: 'fail', message: 'Only collegeadmin, professor, or admin can view students.' });
  }
  next();
}, getAllStudents);

router.get('/students/unapproved', checkAuth, (req, res, next) => {
  if (!(req.user.role === 'collegeadmin' || req.user.role === 'professor' || req.user.role === 'admin')) {
    return res.status(403).json({ status: 'fail', message: 'Only collegeadmin, professor, or admin can view unapproved students.' });
  }
  next();
}, getUnapprovedStudents);

router.post('/students/approve', checkAuth, (req, res, next) => {
  if (!(req.user.role === 'collegeadmin' || req.user.role === 'professor' || req.user.role === 'admin')) {
    return res.status(403).json({ status: 'fail', message: 'Only collegeadmin, professor, or admin can approve students.' });
  }
  next();
}, approveStudent);

router.delete('/students/delete', checkAuth, (req, res, next) => {
  if (!(req.user.role === 'collegeadmin' || req.user.role === 'professor' || req.user.role === 'admin')) {
    return res.status(403).json({ status: 'fail', message: 'Only collegeadmin, professor, or admin can delete students.' });
  }
  next();
}, deleteStudent);

// CollegeAdmin or Professor can add students (current, not alumni)
router.post('/students', checkAuth, (req, res, next) => {
  if (!(req.user.role === 'collegeadmin' || req.user.role === 'professor' || req.user.role === 'admin')) {
    return res.status(403).json({ status: 'fail', message: 'Only collegeadmin, professor, or admin can add students.' });
  }
  // Force role to student
  req.body.role = 'student';
  next();
}, registerController);

// Approve user (admin only)
router.post('/approve', checkAuth, (req, res, next) => {
  if (!(req.user.role === 'admin' || req.user.role === 'collegeadmin')) {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin or collegeadmin can approve users.'
    });
  }
  next();
}, approveUser);

// Only admin can access user management endpoints
router.get('/all', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'collegeadmin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Only admin or collegeadmin can access all users.'
    });
  }
  next();
}, getAllUsers);




// Delete college admin (admin only)
router.delete('/collegeadmin/delete', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ status: 'fail', message: 'Only admin can delete college admins.' });
  }
  next();
}, deleteCollegeAdmin);

// Generic delete user (admin only)
router.delete('/delete', checkAuth, (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'collegeadmin') {
    return res.status(403).json({ status: 'fail', message: 'Only admin or collegeadmin can delete users.' });
  }
  next();
}, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ status: 'fail', message: 'userId is required' });
    }
    const user = await require('../models/user').User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }
    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ status: 'fail', message: 'Cannot delete admin users.' });
    }
    // Remove from profile collection if needed
    if (user.role === 'student') {
      await require('../models/studentModel').findOneAndDelete({ user: userId });
    } else if (user.role === 'alumni') {
      await require('../models/alumniModel').Alumni.findOneAndDelete({ user: userId });
    } else if (user.role === 'professor') {
      await require('../models/professorModel').Professor.findOneAndDelete({ user: userId });
    } else if (user.role === 'collegeadmin') {
      await require('../models/collegeModel').CollegeAdmin.findOneAndDelete({ user: userId });
    }
    await require('../models/user').User.findByIdAndDelete(userId);
    res.status(200).json({ status: 'success', message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
});

// Update student (admin, collegeadmin, professor with role-based access)
router.put('/students/update', checkAuth, (req, res, next) => {
  const user = req.user;
  if (!['admin', 'collegeadmin', 'professor'].includes(user.role)) {
    return res.status(403).json({ status: 'fail', message: 'Only admin, collegeadmin, or professor can update students.' });
  }
  next();
}, updateStudent);

module.exports = router;
