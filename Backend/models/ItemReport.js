import mongoose from "mongoose";

const itemReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["lost", "found"], required: true }, // lost or found
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ItemReport", itemReportSchema);
