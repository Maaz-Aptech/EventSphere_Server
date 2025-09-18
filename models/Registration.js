import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registeredOn: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["confirmed", "waitlist", "cancelled"],
      default: "confirmed",
    },
    attended: { type: Boolean, default: false },
    certificatePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);
