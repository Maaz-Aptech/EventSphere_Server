import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["technical", "cultural", "sports", "academic", "workshop"],
      required: true,
    },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    venue: { type: String, required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizerName: { type: String },
    department: { type: String },
    maxParticipants: { type: Number, default: 0 },
    registeredCount: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },
    imageUrl: { type: String },
    certificateFee: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

// Dynamic status
eventSchema.virtual("status").get(function () {
  const now = new Date();
  if (now < this.startDateTime) return "upcoming";
  if (now >= this.startDateTime && now <= this.endDateTime) return "ongoing";
  return "completed";
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

export default mongoose.model("Event", eventSchema);
