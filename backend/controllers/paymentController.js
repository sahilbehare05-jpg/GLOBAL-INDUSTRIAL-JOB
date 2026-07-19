const Payment = require("../models/Payment");
const Notice = require("../models/Notice");
const User = require("../models/User");

// Send Expo push notification
const sendPushNotification = async (pushToken, title, body, data = {}) => {
  try {
    if (!pushToken) return;

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
      }),
    });

    const result = await response.json();
    console.log("PUSH NOTIFICATION RESULT:", result);
  } catch (error) {
    // Notification failure should NOT break payment request
    console.error("PUSH NOTIFICATION ERROR:", error.message);
  }
};

// @desc User marks "I Have Paid" -> creates pending payment request
// @route POST /api/payments
const createPaymentRequest = async (req, res) => {
  try {
    const { noticeId } = req.body;

    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    const existing = await Payment.findOne({
      user: req.user._id,
      notice: noticeId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "Payment request already pending",
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      notice: noticeId,
      amount: notice.price,
      status: "pending",
    });

    // Find admins who have registered a push token
    const admins = await User.find({
      role: "admin",
      pushToken: { $nin: ["", null] },
    }).select("pushToken");

    // Send notification to every registered admin device/account
    for (const adminUser of admins) {
      await sendPushNotification(
        adminUser.pushToken,
        "New Payment Request",
        `${req.user.name || "A user"} submitted a payment request for "${notice.title}".`,
        {
          type: "payment_request",
          paymentId: String(payment._id),
          noticeId: String(notice._id),
        },
      );
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get all pending payments (admin)
// @route GET /api/payments/pending
const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: "pending",
    })
      .populate("user", "name email")
      .populate("notice", "title price");

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Approve a payment -> grants access
// @route PATCH /api/payments/:id/approve
const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    payment.status = "approved";
    await payment.save();

    await User.findByIdAndUpdate(payment.user, {
      $addToSet: {
        purchasedNotices: payment.notice,
      },
    });

    res.json({
      message: "Payment approved, access granted",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Reject a payment
// @route PATCH /api/payments/:id/reject
const rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    payment.status = "rejected";
    await payment.save();

    res.json({
      message: "Payment rejected",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentRequest,
  getPendingPayments,
  approvePayment,
  rejectPayment,
};