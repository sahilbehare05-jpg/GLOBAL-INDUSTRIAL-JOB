const Notice = require("../models/Notice");
const User = require("../models/User");
const Payment = require("../models/Payment");

// @desc Get all published notices (for users) with optional search/category filter
// @route GET /api/notices
const getNotices = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isPublished: true };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "All") {
      filter.category = category;
    }

    const notices = await Notice.find(filter).sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all notices for admin (published + unpublished)
// @route GET /api/notices/admin/all
const getAllNoticesAdmin = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single notice; premium content hidden unless purchased
// @route GET /api/notices/:id
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    let hasAccess = !notice.isPremium;

    if (notice.isPremium && req.user) {
      hasAccess = req.user.purchasedNotices?.some(
        (id) => id.toString() === notice._id.toString()
      );
    }

    res.json({
      ...notice._doc,
      fullInformation: hasAccess ? notice.fullInformation : null,
      hasAccess,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create notice
// @route POST /api/notices
const createNotice = async (req, res) => {
  try {
    const { title, shortDescription, fullInformation, category, isPremium, price, date } =
      req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const notice = await Notice.create({
  title,
  shortDescription,
  fullInformation,
  category,
  isPremium: isPremium === "true" || isPremium === true,
  price: price || 99,
  date: date || Date.now(),
  imageUrl,
  isPublished: true,
});

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update notice
// @route PUT /api/notices/:id
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    const fields = ["title", "shortDescription", "fullInformation", "category", "price", "date"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) notice[f] = req.body[f];
    });

    if (req.body.isPremium !== undefined) {
      notice.isPremium = req.body.isPremium === "true" || req.body.isPremium === true;
    }

    if (req.file) {
      notice.imageUrl = `/uploads/${req.file.filename}`;
    }

    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete notice
// @route DELETE /api/notices/:id
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    await notice.deleteOne();
    res.json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Publish / Unpublish notice
// @route PATCH /api/notices/:id/publish
const togglePublish = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    notice.isPublished = !notice.isPublished;
    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePublish,
};
