const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    fullInformation: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 99 },
    imageUrl: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
