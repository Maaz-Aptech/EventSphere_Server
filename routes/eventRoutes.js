import express from "express";
import multer from "multer";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", upload.single("image"), createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
