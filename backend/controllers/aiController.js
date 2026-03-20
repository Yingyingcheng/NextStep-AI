const {
  conceptExplainPrompt,
  questionAnswerPrompt,
  gapAnalysisPrompt,
} = require("../utils/prompts");
const User = require("../models/User");
const Session = require("../models/Session");

const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const parsePdf = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text || "";
};

const extractResumeText = async (resumeUrl) => {
  if (!resumeUrl) {
    console.log("[AI] No resume URL provided");
    return "";
  }

  try {
    console.log("[AI] Fetching resume from:", resumeUrl);
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      console.log("[AI] Resume fetch failed with status:", response.status);
      return "";
    }

    const arrayBuf = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    console.log("[AI] Resume downloaded, size:", buffer.length, "bytes");

    const url = resumeUrl.toLowerCase();

    if (url.includes(".pdf")) {
      const text = await parsePdf(buffer);
      console.log("[AI] PDF parsed, text length:", text.length);
      return text;
    }

    if (url.match(/\.docx?/)) {
      const result = await mammoth.extractRawText({ buffer });
      console.log("[AI] DOCX parsed, text length:", result.value?.length);
      return result.value;
    }

    // Cloudinary URLs may not include file extensions — try PDF first, then DOCX
    console.log("[AI] No file extension detected in URL, trying PDF parser...");
    try {
      const text = await parsePdf(buffer);
      if (text.trim()) {
        console.log("[AI] PDF parsed (no ext), text length:", text.length);
        return text;
      }
      console.log("[AI] PDF parser returned empty text");
    } catch (pdfErr) {
      console.log("[AI] PDF parse attempt failed:", pdfErr.message);
    }

    try {
      const result = await mammoth.extractRawText({ buffer });
      if (result.value?.trim()) {
        console.log(
          "[AI] DOCX parsed (no ext), text length:",
          result.value.length,
        );
        return result.value;
      }
      console.log("[AI] DOCX parser returned empty text");
    } catch (docxErr) {
      console.log("[AI] DOCX parse attempt failed:", docxErr.message);
    }

    console.log("[AI] Could not parse resume — unsupported format");
    return "";
  } catch (error) {
    console.log("[AI] Failed to parse resume:", error.message);
    return "";
  }
};
let ai = null;
if (
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE"
) {
  const { GoogleGenAI } = require("@google/genai");
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

const callGemini = async (prompt, retriesLeft = 3, waitSec = 15) => {
  for (const model of MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      const msg = err.message || "";
      const isRetryable =
        msg.includes("429") ||
        msg.includes("500") ||
        msg.includes("503") ||
        msg.includes("timeout") ||
        msg.includes("ECONNRESET") ||
        msg.includes("overloaded") ||
        msg.includes("model") ||
        msg.includes("unavailable");
      console.log(
        `[AI] ${model} failed (${isRetryable ? "retryable" : "fatal"}): ${msg}`,
      );
      if (!isRetryable) throw err;
    }
  }
  if (retriesLeft > 0) {
    console.log(
      `[AI] All models rate-limited, waiting ${waitSec}s before retry (${retriesLeft} retries left)…`,
    );
    await new Promise((r) => setTimeout(r, waitSec * 1000));
    return callGemini(prompt, retriesLeft - 1, Math.min(waitSec * 2, 60));
  }
  throw new Error(
    "All Gemini models are rate-limited. Please try again in a minute.",
  );
};

const stripCodeFences = (text) =>
  text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

// --------------- Mock helpers ---------------
const CATEGORIES = ["coding", "system-design", "behavioral", "general"];

const generateMockQuestions = (role, experience, topicsToFocus, count) => {
  const topics = topicsToFocus.split(",").map((t) => t.trim());
  const templates = [
    (t, r) => ({
      question: `What is ${t} and why is it important for a ${r}?`,
      answer: `**${t}** is a fundamental concept in modern ${r} work.\n\n### Key Points\n- It helps structure and organize code effectively.\n- It promotes reusability and maintainability.\n- Interviewers frequently ask about it.\n\n\`\`\`js\n// Example usage of ${t}\nconst example = () => {\n  console.log("${t} in action!");\n};\nexample();\n\`\`\`\n\nMake sure you can explain ${t} with real-world examples.`,
      category: "coding",
    }),
    (t, r) => ({
      question: `Explain the difference between ${t} and its alternatives.`,
      answer: `Understanding ${t} vs alternatives is crucial for a ${r}.\n\n### Comparison\n| Feature | ${t} | Alternative |\n|---------|------|-------------|\n| Performance | High | Varies |\n| Learning Curve | Moderate | Varies |\n| Community | Large | Varies |\n\n### When to use ${t}\n- Large-scale applications\n- Team collaboration\n- When performance matters\n\n\`\`\`js\n// ${t} approach\nconst handle = () => {\n  // ${t}-specific pattern\n  return true;\n};\n\`\`\``,
      category: "general",
    }),
    (t, r) => ({
      question: `How would you design a scalable ${t} system?`,
      answer: `Designing a scalable ${t} system is a key skill for any ${r}.\n\n### Architecture Considerations\n1. **Load Balancing** – Distribute traffic evenly\n2. **Caching** – Reduce database load\n3. **Microservices** – Independent scaling\n\n\`\`\`js\n// Basic architecture pattern\nconst systemDesign = {\n  loadBalancer: 'nginx',\n  cache: 'Redis',\n  database: 'PostgreSQL'\n};\n\`\`\`\n\nAlways start with requirements and constraints.`,
      category: "system-design",
    }),
    (t, r) => ({
      question: `Tell me about a time you faced a challenge working with ${t} in a team.`,
      answer: `This behavioral question tests your teamwork and communication skills.\n\n### STAR Framework\n- **Situation**: Describe the project context\n- **Task**: What was your responsibility?\n- **Action**: What steps did you take?\n- **Result**: What was the outcome?\n\nBe specific and focus on your personal contribution.`,
      category: "behavioral",
    }),
    (t, r) => ({
      question: `How would you optimize performance in a ${t} application?`,
      answer: `Performance optimization is critical for a ${r} working with ${t}.\n\n### Key Techniques\n1. **Code Splitting** – Load only what's needed\n2. **Memoization** – Cache expensive computations\n3. **Lazy Loading** – Defer non-critical resources\n4. **Virtualization** – Render only visible items\n\n\`\`\`js\nimport React, { memo, useMemo } from 'react';\n\nconst ExpensiveComponent = memo(({ data }) => {\n  const processed = useMemo(() => data.map(transform), [data]);\n  return <List items={processed} />;\n});\n\`\`\`\n\nAlways measure before optimizing!`,
      category: "coding",
    }),
  ];
  const questions = [];
  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const template = templates[i % templates.length];
    questions.push(template(topic, role));
  }
  return questions;
};

const generateMockExplanation = (question) => ({
  title: question.length > 60 ? question.substring(0, 60) + "…" : question,
  explanation:
    `## Concept Overview\n\n` +
    `**"${question}"**\n\n` +
    `### Why This Matters\n` +
    `This is one of the most commonly asked interview questions. Understanding the underlying concept shows depth of knowledge.\n\n` +
    `### Detailed Explanation\n` +
    `- The concept addresses a fundamental challenge in software development.\n` +
    `- It has practical applications in real-world projects.\n` +
    `- Interviewers expect both theoretical understanding and hands-on experience.\n\n` +
    `### Code Example\n` +
    `\`\`\`js\n// Practical demonstration\nfunction demonstrate() {\n  // Step 1: Setup\n  const config = { optimize: true };\n  \n  // Step 2: Implementation\n  return processData(config);\n}\n\`\`\`\n\n` +
    `### Tips for Your Interview\n` +
    `1. Start with a high-level explanation\n` +
    `2. Give a concrete example\n` +
    `3. Mention trade-offs and alternatives\n` +
    `4. Relate it to your own experience`,
});

const generateMockGapAnalysis = (userProfile, sessionTarget) => ({
  readinessScore: 55,
  matchingSkills: userProfile.skills?.slice(0, 3) || ["General programming"],
  gaps: [
    {
      skill: sessionTarget.topicsToFocus?.split(",")[0]?.trim() || "Core topic",
      importance: "high",
      suggestion: "Dedicate focused study time to this core area.",
    },
    {
      skill: "System Design",
      importance: "medium",
      suggestion:
        "Practice common system design patterns and whiteboard exercises.",
    },
  ],
  strengths: [
    "Foundational knowledge in relevant technologies",
    userProfile.workExperience?.length
      ? "Hands-on industry experience"
      : "Academic background in computer science",
  ],
  recommendations: [
    `Focus on ${sessionTarget.topicsToFocus || "the listed topics"} for this role`,
    "Practice explaining concepts out loud using the STAR method for behavioral questions",
    "Review common coding patterns and data structures",
    "Build a small project demonstrating your skills in the target area",
    !userProfile.resumeText
      ? "Upload your resume to get a more accurate gap analysis"
      : "Your resume was analyzed for additional context",
  ],
  analyzedAt: new Date(),
});

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (ai) {
      try {
        const prompt = questionAnswerPrompt(
          role,
          experience,
          topicsToFocus,
          numberOfQuestions,
        );
        const rawText = await callGemini(prompt);
        const data = JSON.parse(stripCodeFences(rawText));
        return res.status(200).json(data);
      } catch (aiError) {
        console.log(
          "[AI] Gemini failed, falling back to mock data:",
          aiError.message,
        );
      }
    }

    console.log("[AI] Using mock questions");
    const mockData = generateMockQuestions(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    );
    res.status(200).json(mockData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explains a interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (ai) {
      try {
        const prompt = conceptExplainPrompt(question);
        const rawText = await callGemini(prompt);
        const data = JSON.parse(stripCodeFences(rawText));
        return res.status(200).json(data);
      } catch (aiError) {
        console.log(
          "[AI] Gemini failed, falling back to mock data:",
          aiError.message,
        );
      }
    }

    console.log("[AI] Using mock explanation");
    const mockData = generateMockExplanation(question);
    res.status(200).json(mockData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

// @desc    Analyze gap between user profile and session target role
// @route   POST /api/ai/analyze-gap/:sessionId
// @access  Private
const generateGapAnalysis = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const user = await User.findById(req.user._id).select(
      "skills education workExperience projects resumeUrl",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // SELECT * FROM sessions
    // WHERE _id = :sessionId AND user = :currentUserId
    // LIMIT 1
    const session = await Session.findOne({
      _id: sessionId,
      user: req.user._id,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const resumeText = await extractResumeText(user.resumeUrl);

    const userProfile = {
      skills: user.skills,
      education: user.education,
      workExperience: user.workExperience,
      projects: user.projects,
      resumeText,
    };

    const sessionTarget = {
      role: session.role,
      experience: session.experience,
      topicsToFocus: session.topicsToFocus,
    };

    let analysisData;

    if (ai) {
      try {
        const prompt = gapAnalysisPrompt(userProfile, sessionTarget);
        const rawText = await callGemini(prompt);
        analysisData = JSON.parse(stripCodeFences(rawText));
      } catch (aiError) {
        console.log(
          "[AI] Gemini gap analysis failed, using mock:",
          aiError.message,
        );
      }
    }

    if (!analysisData) {
      console.log("[AI] Using mock gap analysis");
      analysisData = generateMockGapAnalysis(userProfile, sessionTarget);
    }

    analysisData.analyzedAt = new Date();

    session.gapAnalysis = analysisData;
    await session.save();

    res.status(200).json(analysisData);
  } catch (error) {
    console.error("Gap analysis error:", error);
    res.status(500).json({
      message: "Failed to generate gap analysis",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateGapAnalysis,
};
