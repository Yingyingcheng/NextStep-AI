const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { upload, uploadResume } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("[upload-image] Upload error:", err.message || err);
      return res
        .status(500)
        .json({ message: "Image upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ imageUrl: req.file.path });
  });
});

router.post("/upload-resume", protect, (req, res) => {
  uploadResume.single("resume")(req, res, (err) => {
    if (err) {
      console.error("[upload-resume] Upload error:", err.message || err);
      return res
        .status(500)
        .json({ message: "Resume upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ resumeUrl: req.file.path });
  });
});

module.exports = router;
