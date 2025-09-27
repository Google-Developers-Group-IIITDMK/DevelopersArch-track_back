import Message from "../models/Message.js";
import ItemReport from "../models/ItemReport.js";

export const getMessagesByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const messages = await Message.find({ report: reportId })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { message, isPublic = true } = req.body;

    const report = await ItemReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const newMessage = new Message({
      report: reportId,
      user: req.user.id,
      message,
      isPublic,
    });

    await newMessage.save();
    await newMessage.populate("user", "name email");

    res.status(201).json({
      message: "Message sent successfully",
      message: newMessage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate("report");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isAuthor = message.user.toString() === req.user.id;
    const isReportOwner = message.report.user.toString() === req.user.id;

    if (!isAuthor && !isReportOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
