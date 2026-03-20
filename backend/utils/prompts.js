const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => `
You are a senior technical interviewer with 15+ years of experience hiring for top tech companies. Your goal is to generate realistic, high-quality interview questions and detailed answers tailored to the candidate's profile.

## Candidate Profile
- **Target Role:** ${role}
- **Experience Level:** ${experience} year(s)
- **Focus Topics:** ${topicsToFocus}

## Instructions
1. Generate exactly ${numberOfQuestions} interview questions.
2. Tailor difficulty to the candidate's experience level:
   - 0–1 years: Fundamental concepts, definitions, and basic usage.
   - 2–4 years: Applied knowledge, trade-offs, debugging scenarios, and practical patterns.
   - 5+ years: System design considerations, architecture decisions, performance optimization, and leadership-oriented questions.
3. Mix question types for variety — include conceptual, practical/coding, scenario-based, and comparison questions.
4. For each question, classify it into exactly ONE category:
   - "coding" — questions about algorithms, data structures, code implementation, debugging, language-specific features
   - "system-design" — questions about architecture, scalability, databases, distributed systems, API design
   - "behavioral" — questions about teamwork, leadership, conflict resolution, past experiences, communication
   - "general" — questions that don't fit neatly into the above (e.g., broad conceptual or mixed-topic questions)
5. For each question, write a comprehensive answer that:
   - Starts with a clear, concise summary (1–2 sentences).
   - Follows with a detailed explanation using real-world analogies where helpful.
   - Includes a clean, well-commented code example when relevant (use markdown code blocks with the appropriate language tag).
   - Mentions common mistakes or pitfalls candidates should avoid.
6. Answers should be written in **Markdown** format for readability.
7. Questions should progress from foundational to advanced within the set.

## Output Format
Return ONLY a valid JSON array — no surrounding text, no markdown fences, no commentary.

[
  {
    "question": "Your interview question here?",
    "answer": "Detailed markdown-formatted answer here.",
    "category": "coding"
  }
]

Important: Return exactly ${numberOfQuestions} objects. Each must have "question", "answer", and "category" fields. Output must be valid, parseable JSON with no trailing commas.
`;

const conceptExplainPrompt = (question) => `
You are an expert software engineering educator known for making complex technical concepts easy to understand. Your explanations are thorough yet approachable, using real-world analogies and practical examples.

## Task
Explain the following interview question and its underlying concept in depth:

**Question:** "${question}"

## Instructions
1. Write a short, descriptive title (under 10 words) that captures the core concept — suitable for an article or page header.
2. Write a comprehensive explanation that:
   - Opens with a brief, intuitive summary a beginner can immediately grasp.
   - Breaks the concept down step by step, building from simple to complex.
   - Uses a real-world analogy to make the concept relatable.
   - Includes a clear, well-commented code example (using markdown code blocks with the language tag) demonstrating the concept in action.
   - Highlights common misconceptions or mistakes developers make.
   - Ends with a concise "Key Takeaway" summary (1–2 sentences).
3. Use **Markdown** formatting throughout for readability (headings, bold, lists, code blocks).

## Output Format
Return ONLY a valid JSON object — no surrounding text, no markdown fences, no commentary.

{
  "title": "Short Descriptive Title",
  "explanation": "Full markdown-formatted explanation here."
}

Important: Output must be valid, parseable JSON. Escape any special characters within string values properly.
`;

const gapAnalysisPrompt = (userProfile, sessionTarget) => `
You are an expert career coach and technical hiring consultant. Analyze the gap between a candidate's current profile and their target interview role.

## Candidate's Current Profile
- **Skills:** ${userProfile.skills?.join(", ") || "Not specified"}
- **Education:** ${userProfile.education?.map((e) => `${e.degree || ""} ${e.fieldOfStudy || ""} at ${e.school}`).join("; ") || "Not specified"}
- **Work Experience:** ${userProfile.workExperience?.map((w) => `${w.title} at ${w.company} (${w.description || "no description"})`).join("; ") || "Not specified"}
- **Projects:** ${userProfile.projects?.map((p) => `${p.name}: ${p.description || "no description"}`).join("; ") || "Not specified"}
- **Resume Content:** ${userProfile.resumeText ? userProfile.resumeText.substring(0, 4000) : "No resume uploaded"}

## Target Interview
- **Role:** ${sessionTarget.role}
- **Experience Level Required:** ${sessionTarget.experience} year(s)
- **Topics to Focus On:** ${sessionTarget.topicsToFocus}

## Instructions
1. Assess the candidate's readiness for this specific role and interview on a scale of 0–100.
2. Identify which of the candidate's existing skills directly match the target role's requirements.
3. Identify skill gaps — areas where the candidate needs improvement to succeed in this interview.
4. For each gap, rate its importance ("high", "medium", or "low") and provide a specific, actionable suggestion.
5. List 2–4 key strengths the candidate brings to this role based on their profile.
6. Provide 3–5 specific, actionable recommendations for preparation.
7. Be realistic but encouraging. If the profile is sparse, note that more profile data would improve the analysis.

## Output Format
Return ONLY a valid JSON object — no surrounding text, no markdown fences, no commentary.

{
  "readinessScore": 65,
  "matchingSkills": ["JavaScript", "React", "Node.js"],
  "gaps": [
    {
      "skill": "System Design",
      "importance": "high",
      "suggestion": "Practice designing scalable systems. Start with common patterns like URL shorteners and chat applications."
    }
  ],
  "strengths": [
    "Strong frontend development background with React experience"
  ],
  "recommendations": [
    "Focus 60% of prep time on system design questions",
    "Review data structures and algorithms fundamentals"
  ]
}

Important: Output must be valid, parseable JSON. readinessScore must be a number 0–100. gaps importance must be "high", "medium", or "low".
`;

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
  gapAnalysisPrompt,
};
