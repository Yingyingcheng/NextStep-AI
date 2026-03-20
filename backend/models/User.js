const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },

    resumeUrl: { type: String, default: null },

    education: [
      {
        school: { type: String, required: true },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    workExperience: [
      {
        company: { type: String, required: true },
        title: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
      },
    ],
    skills: [{ type: String }],
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String },
        url: { type: String },
      },
    ],
    contact: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
