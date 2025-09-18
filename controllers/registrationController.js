import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

export const getAllRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find();
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    const existing = await Registration.findOne({ eventId, studentId });
    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registration = new Registration({ eventId, studentId });
    await registration.save();

    event.registeredCount += 1;
    await event.save();

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;
    await Registration.findOneAndDelete({ eventId, studentId });
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { eventId, studentId, attended } = req.body;
    const reg = await Registration.findOneAndUpdate(
      { eventId, studentId },
      { attended },
      { new: true }
    );
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markCertificatePaid = async (req, res) => {
  try {
    const { eventId, studentId, certificatePaid } = req.body;

    const reg = await Registration.findOneAndUpdate(
      { eventId, studentId },
      { certificatePaid },
      { new: true }
    );

    if (!reg) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
