require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateGapAnalysis,
} = require("./controllers/aiController");

const app = express();

// Middleware to handle CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2, // Add more as needed
  "http://localhost:5173",
  "http://148.100.76.140",
  "http://148.100.76.140/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// Client Request
// │
// ▼
// protect(req, res, next)     ← checks authentication
// │
// ├─ Token valid?  ──YES──▶  next()  ──▶  Your route handler runs
// │
// └─ Token invalid/missing? ──▶  res.status(401)  ──▶  Request stops here

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);
app.post("/api/ai/analyze-gap/:sessionId", protect, generateGapAnalysis);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Root route for friendly message
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
