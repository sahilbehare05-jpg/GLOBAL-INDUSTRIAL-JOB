const express = require("express");
const router = express.Router();
const {
  createPaymentRequest,
  getPendingPayments,
  approvePayment,
  rejectPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.post("/", protect, createPaymentRequest);
router.get("/pending", protect, admin, getPendingPayments);
router.get("/status/:noticeId", protect, async (req, res) => {
  try {
    const Payment = require("../models/Payment");

    const payment = await Payment.findOne({
      user: req.user._id,
      notice: req.params.noticeId,
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.json({ status: "none" });
    }

    res.json({
      status: payment.status,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.patch("/:id/approve", protect, admin, approvePayment);
router.patch("/:id/reject", protect, admin, rejectPayment);

module.exports = router;
