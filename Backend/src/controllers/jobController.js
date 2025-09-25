// controllers/jobController.js
const { Job } = require("../models/job");

// Controller to create a job (collegeadmin, professor, alumni only)
const createJobController = async (req, res) => {
  try {
    if (!["collegeadmin", "professor", "alumni"].includes(req.user.role)) {
      return res.status(403).json({ status: "fail", message: "Only collegeadmins, professors, or alumni can post jobs." });
    }
    const { title, description, vacancy, link } = req.body;
    const createdBy = req.user._id;
    const job = await Job.create({
      title,
      description,
      vacancy,
      link,
      createdBy,
    });
    res.status(201).json({
      status: "success",
      data: { job },
    });
  } catch (error) {
    console.error("Error during job creation:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
// Controller for students to apply for a job
const applyJobController = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ status: "fail", message: "Only students can apply for jobs." });
    }
    // You may want to store applications in a separate collection, or add an array to Job
    // For now, just return success (implement actual storage as needed)
    // const { jobId } = req.params;
    // const { coverLetter, resumeUrl } = req.body;
    // Save application logic here
    res.status(200).json({ status: "success", message: "Application submitted (demo, not stored)." });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

// Controller to get all jobs
const getAllJobsController = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "email role"); // Populate createdBy field with user details
    res.status(200).json({
      status: "success",
      data: {
        jobs,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};


// Update a job (admin/collegeadmin: any job, professor/alumni: only their own)
const updateJobController = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ status: "fail", message: "Job not found." });
    const userRole = req.user.role;
    const isOwner = String(job.createdBy) === String(req.user._id);
    if (
      userRole === "admin" ||
      userRole === "collegeadmin" ||
      (userRole === "professor" && isOwner) ||
      (userRole === "alumni" && isOwner)
    ) {
      const { title, description, vacancy, link } = req.body;
      if (title) job.title = title;
      if (description) job.description = description;
      if (vacancy) job.vacancy = vacancy;
      if (link !== undefined) job.link = link;
      await job.save();
      res.status(200).json({ status: "success", data: { job } });
    } else {
      return res.status(403).json({ status: "fail", message: "You do not have permission to update this job." });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

// Delete a job (admin/collegeadmin: any job, professor/alumni: only their own)
const deleteJobController = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ status: "fail", message: "Job not found." });
    const userRole = req.user.role;
    const isOwner = String(job.createdBy) === String(req.user._id);
    if (
      userRole === "admin" ||
      userRole === "collegeadmin" ||
      (userRole === "professor" && isOwner) ||
      (userRole === "alumni" && isOwner)
    ) {
      await job.deleteOne();
      res.status(200).json({ status: "success", message: "Job deleted successfully." });
    } else {
      return res.status(403).json({ status: "fail", message: "You do not have permission to delete this job." });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = {
  createJobController,
  getAllJobsController,
  applyJobController,
  updateJobController,
  deleteJobController,
};
