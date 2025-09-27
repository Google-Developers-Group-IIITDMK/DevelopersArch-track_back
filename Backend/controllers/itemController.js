import ItemReport from "../models/ItemReport.js";
import cloudinary from "../config/cloudinary.js";


export const createItem = async (req, res) => {
  try {
    const { title, description, location, type } = req.body;
    const image = req.file?.path;
    const imageId = req.file?.filename;

    const newItem = new ItemReport({
      title,
      description,
      location,
      type,
      user: req.user.id,
      image,
      imageId,
    });

    await newItem.save();
    res.status(201).json({ message: "Item report created", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await ItemReport.find().populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLostItems = async (req, res) => {
  try {
    const items = await ItemReport.find({ type: "lost" }).populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFoundItems = async (req, res) => {
  try {
    const items = await ItemReport.find({ type: "found" }).populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserItems = async (req, res) => {
  try {
    const items = await ItemReport.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await ItemReport.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    if (req.file) {
      if (item.imageId) await cloudinary.uploader.destroy(item.imageId);
      item.image = req.file.path;
      item.imageId = req.file.filename;
    }

    Object.assign(item, req.body);
    await item.save();
    res.json({ message: "Item updated", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await ItemReport.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.user.toString() !== req.user.id) return res.status(401).json({ message: "Unauthorized" });

    if (item.imageId) await cloudinary.uploader.destroy(item.imageId);

    await item.remove();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
