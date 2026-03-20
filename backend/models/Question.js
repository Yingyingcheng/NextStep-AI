const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  question: String,
  answer: String,
  note: String,
  isPinned: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ["coding", "system-design", "behavioral", "general"],
    default: "general",
  },
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
