const { Event } = require("../models/eventModel");

const createEventController = async (req, res) => {
  try {
    // Only collegeadmin or professor can create events
    if (!(req.user.role === "collegeadmin" || req.user.role === "professor")) {
      return res.status(403).json({
        status: "fail",
        message: "Only collegeadmin or professor can create events."
      });
    }
    const { title, date, location, description } = req.body;
    const createdBy = req.user._id;

    const event = await Event.create({
      title,
      date,
      location,
      description,
      createdBy,
    });

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getAllEventsController = async (req, res) => {
  try {
    const events = await Event.find().populate(
      "createdBy",
      "firstName lastName"
    ); // Populate createdBy with user details

    res.status(200).json({
      status: "success",
      data: {
        events,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// Update event (only by creator)
const updateEventController = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found." });
    }
    // Only creator (collegeadmin or professor) can update
    if (!event.createdBy.equals(req.user._id) || !(req.user.role === "collegeadmin" || req.user.role === "professor")) {
      return res.status(403).json({ status: "fail", message: "You can only update your own events." });
    }
    const { title, date, location, description } = req.body;
    event.title = title || event.title;
    event.date = date || event.date;
    event.location = location || event.location;
    event.description = description || event.description;
    await event.save();
    res.status(200).json({ status: "success", data: { event } });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

// Delete event (only by creator)
const deleteEventController = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found." });
    }
    // Only creator (collegeadmin or professor) can delete
    if (!event.createdBy.equals(req.user._id) || !(req.user.role === "collegeadmin" || req.user.role === "professor")) {
      return res.status(403).json({ status: "fail", message: "You can only delete your own events." });
    }
    await event.deleteOne();
    res.status(200).json({ status: "success", message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = { createEventController, getAllEventsController, updateEventController, deleteEventController };
