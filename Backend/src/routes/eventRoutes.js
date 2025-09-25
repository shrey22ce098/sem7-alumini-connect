const express = require("express");
const router = express.Router();
const {
  createEventController,
  getAllEventsController,
  updateEventController,
  deleteEventController,
} = require("../controllers/eventController");
const checkAuth = require("../middlewares/checkAuth");

// Assuming you have middleware for authentication
router.use(checkAuth);


// CRUD routes
router.post("/create", createEventController);
router.get("/all", getAllEventsController);
router.put("/update/:id", updateEventController);
router.delete("/delete/:id", deleteEventController);

module.exports = router;
