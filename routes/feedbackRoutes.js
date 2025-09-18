import express from "express";
import { addFeedback, getEventFeedback, getAverageRating } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addFeedback);
router.get("/:eventId", getEventFeedback);
router.get("/:eventId/average", getAverageRating);

export default router;
