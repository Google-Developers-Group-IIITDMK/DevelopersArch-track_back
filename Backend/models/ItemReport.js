import mongoose from "mongoose";

const itemReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  status: { type: String, enum: ["lost", "found"], required: true },
  location: String,
  imageURL: String,
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("ItemReport", itemReportSchema);
