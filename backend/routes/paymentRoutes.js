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
router.patch("/:id/approve", protect, admin, approvePayment);
router.patch("/:id/reject", protect, admin, rejectPayment);

module.exports = router;
