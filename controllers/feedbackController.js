import Feedback from "../models/Feedback.js";

// @desc Add feedback for an event
// @route POST /api/feedback
// @access Private (student)
export const addFeedback = async (req, res) => {
  try {
    const { eventId, rating, comments } = req.body;
    const studentId = req.user?.id;

    if (!eventId || !rating) {
      return res.status(400).json({ message: "Event and rating are required" });
    }

    const feedback = await Feedback.create({
  eventId,
  studentId,
  rating,
  comments,
});

// repopulate so studentId is full object
const populatedFeedback = await feedback.populate("studentId", "fullName email");

res.status(201).json(populatedFeedback);

  } catch (err) {
    console.error("addFeedback error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get feedback for an event
// @route GET /api/feedback/:eventId
// @access Public
export const getEventFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ eventId }).populate("studentId", "fullName email");

    res.json(feedbacks);
  } catch (err) {
    console.error("getEventFeedback error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get average rating for an event
// @route GET /api/feedback/:eventId/average
// @access Public
export const getAverageRating = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await Feedback.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      { $group: { _id: "$eventId", averageRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, count: 0 });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("getAverageRating error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
