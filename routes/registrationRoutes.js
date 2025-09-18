import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  markAttendance,
  markCertificatePaid,
  getAllRegistrations,   // 👈 new controller
} from "../controllers/registrationController.js";

const router = express.Router();

router.get("/", getAllRegistrations);   // 👈 new route
router.post("/", registerForEvent);
router.post("/cancel", cancelRegistration);
router.post("/attendance", markAttendance);
router.post("/certificate", markCertificatePaid);

export default router;
