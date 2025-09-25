// // routes/jobRoutes.js
// const express = require("express");
// const router = express.Router();
// const {
//   createJobController,
//   getAllJobsController,
//   applyJobController,
//   updateJobController,
//   deleteJobController,
// } = require("../controllers/jobController");

// const checkAuth = require("../middlewares/checkAuth");

// // Assuming you have middleware for authentication

// // Post a job (collegeadmin, professor, alumni)
// router.post("/create", checkAuth, createJobController);
// // Get all jobs (all logged-in users)
// router.get("/all", checkAuth, getAllJobsController);

// // Student applies for a job
// router.post("/apply/:jobId", checkAuth, applyJobController);

// // Update a job (only by creator or admin)
// router.put("/update/:id", checkAuth, updateJobController);

// // Delete a job (only by creator or admin)
// router.delete("/delete/:id", checkAuth, deleteJobController);

// module.exports = router;


// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const {
  createJobController,
  getAllJobsController,
  applyJobController,
  updateJobController,
  deleteJobController,
} = require("../controllers/jobController");

const checkAuth = require("../middlewares/checkAuth");

// Assuming you have middleware for authentication

// Post a job (collegeadmin, professor, alumni)
router.post("/create", checkAuth, createJobController);
// Get all jobs (all logged-in users)
router.get("/all", checkAuth, getAllJobsController);

// Student applies for a job
router.post("/apply/:jobId", checkAuth, applyJobController);

// Update a job (only by creator or admin)
router.put("/update/:id", checkAuth, updateJobController);

// Delete a job (only by creator or admin)
router.delete("/delete/:id", checkAuth, deleteJobController);

module.exports = router;
