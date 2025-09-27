import mongoose from "mongoose";

const itemReportSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    type: { type: String, enum: ["lost", "found"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: String,
    imageId: String,
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("ItemReport", itemReportSchema);
