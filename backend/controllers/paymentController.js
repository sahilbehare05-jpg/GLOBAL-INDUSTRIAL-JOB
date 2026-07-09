const Payment = require("../models/Payment");
const Notice = require("../models/Notice");
const User = require("../models/User");

// @desc User marks "I Have Paid" -> creates a pending payment request
// @route POST /api/payments
const createPaymentRequest = async (req, res) => {
  try {
    const { noticeId } = req.body;

    const notice = await Notice.findById(noticeId);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    const existing = await Payment.findOne({
      user: req.user._id,
      notice: noticeId,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({ message: "Payment request already pending" });
    }

    const payment = await Payment.create({
      user: req.user._id,
      notice: noticeId,
      amount: notice.price,
      status: "pending",
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all pending payments (admin)
// @route GET /api/payments/pending
const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("user", "name email")
      .populate("notice", "title price");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve a payment -> grants access
// @route PATCH /api/payments/:id/approve
const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "approved";
    await payment.save();

    await User.findByIdAndUpdate(payment.user, {
      $addToSet: { purchasedNotices: payment.notice },
    });

    res.json({ message: "Payment approved, access granted", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reject a payment
// @route PATCH /api/payments/:id/reject
const rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "rejected";
    await payment.save();

    res.json({ message: "Payment rejected", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentRequest,
  getPendingPayments,
  approvePayment,
  rejectPayment,
};
