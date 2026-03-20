const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  topicsToFocus: { type: String, required: true },
  description: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  gapAnalysis: {
    readinessScore: { type: Number },
    matchingSkills: [{ type: String }],
    gaps: [{
      skill: { type: String },
      importance: { type: String, enum: ["high", "medium", "low"] },
      suggestion: { type: String },
    }],
    strengths: [{ type: String }],
    recommendations: [{ type: String }],
    analyzedAt: { type: Date },
  },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
