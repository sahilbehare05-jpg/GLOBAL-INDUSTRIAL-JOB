const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getNotices,
  getAllNoticesAdmin,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePublish,
} = require("../controllers/noticeController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Simple optional auth: attach user if token present, but do not block request
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get("/", getNotices);
router.get("/admin/all", protect, admin, getAllNoticesAdmin);
router.get("/:id", optionalAuth, getNoticeById);
router.post("/", protect, admin, upload.single("image"), createNotice);
router.put("/:id", protect, admin, upload.single("image"), updateNotice);
router.delete("/:id", protect, admin, deleteNotice);
router.patch("/:id/publish", protect, admin, togglePublish);

module.exports = router;
