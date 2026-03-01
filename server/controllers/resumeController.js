// const pdfParse = require('pdf-parse');
// const mammoth = require('mammoth');
// const Anthropic = require('@anthropic-ai/sdk');
// const Resume = require('../models/Resume');
// const path = require('path');

// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// const calculateAtsScore = (resumeText, jobDescription) => {
//   if (!jobDescription || jobDescription.trim().length === 0) return 75;
//   const extractKeywords = (text) => {
//     const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','need','dare','ought','used','able']);
//     return text.toLowerCase()
//       .replace(/[^a-z0-9\s]/g, ' ')
//       .split(/\s+/)
//       .filter(w => w.length > 3 && !stopWords.has(w));
//   };
//   const jobKeywords = new Set(extractKeywords(jobDescription));
//   const resumeWords = new Set(extractKeywords(resumeText));
//   if (jobKeywords.size === 0) return 75;
//   let matches = 0;
//   jobKeywords.forEach(kw => { if (resumeWords.has(kw)) matches++; });
//   const score = Math.round((matches / jobKeywords.size) * 100);
//   return Math.min(Math.max(score, 20), 99);
// };

// const extractText = async (buffer, mimetype, originalname) => {
//   const ext = path.extname(originalname).toLowerCase();
//   if (ext === '.pdf') {
//     const data = await pdfParse(buffer);
//     return data.text;
//   } else if (ext === '.docx') {
//     const result = await mammoth.extractRawText({ buffer });
//     return result.value;
//   }
//   throw new Error('Unsupported file type');
// };

// const optimizeWithClaude = async (resumeText, jobDescription) => {
//   const jobContext = jobDescription
//     ? `The target job description is:\n${jobDescription}\n\n`
//     : '';
//   const prompt = `Act as a senior HR recruiter and ATS (Applicant Tracking System) specialist with 15+ years of experience.

// ${jobContext}Improve the following resume to score 90%+ for this job description. Your improvements must:

// 1. Add quantifiable achievements and measurable metrics (e.g., "Increased sales by 35%", "Managed team of 12", "Reduced costs by $50K")
// 2. Rewrite weak, vague bullet points with strong action verbs and concrete outcomes
// 3. Optimize keywords naturally for ATS systems based on the job description
// 4. Ensure professional formatting with clear sections
// 5. Keep all factual information accurate — do not fabricate companies, dates, or degrees
// 6. Maintain a professional, concise tone
// 7. Output ONLY the improved resume as clean plain text — no markdown, no commentary, no explanations

// RESUME TO IMPROVE:
// ${resumeText}

// OUTPUT (improved resume only):`;

//   const message = await anthropic.messages.create({
//     model: 'claude-sonnet-4-20250514',
//     max_tokens: 4000,
//     messages: [{ role: 'user', content: prompt }]
//   });
//   return message.content[0].text;
// };

// exports.optimizeResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ success: false, message: 'Please upload a resume file.' });
//     }
//     const { jobDescription = '' } = req.body;
//     const originalText = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
//     if (!originalText || originalText.trim().length < 50) {
//       return res.status(400).json({ success: false, message: 'Could not extract text from file. Ensure it is not scanned/image-based.' });
//     }
//     const improvedText = await optimizeWithClaude(originalText, jobDescription);
//     const atsScore = calculateAtsScore(improvedText, jobDescription);
//     const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
//     const resume = await Resume.create({
//       userId: req.user._id,
//       originalText,
//       improvedText,
//       jobDescription,
//       atsScore,
//       fileName: req.file.originalname,
//       fileType: ext
//     });
//     res.status(201).json({
//       success: true,
//       resume: {
//         id: resume._id,
//         originalText: resume.originalText,
//         improvedText: resume.improvedText,
//         jobDescription: resume.jobDescription,
//         atsScore: resume.atsScore,
//         fileName: resume.fileName,
//         createdAt: resume.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Optimize error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Optimization failed.' });
//   }
// };

// exports.getMyResumes = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const skip = (page - 1) * limit;
//     const total = await Resume.countDocuments({ userId: req.user._id });
//     const resumes = await Resume.find({ userId: req.user._id })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .select('-originalText -improvedText');
//     res.json({
//       success: true,
//       resumes,
//       pagination: { page, limit, total, pages: Math.ceil(total / limit) }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getResumeById = async (req, res) => {
//   try {
//     const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
//     if (!resume) {
//       return res.status(404).json({ success: false, message: 'Resume not found.' });
//     }
//     res.json({ success: true, resume });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.deleteResume = async (req, res) => {
//   try {
//     const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
//     if (!resume) {
//       return res.status(404).json({ success: false, message: 'Resume not found.' });
//     }
//     res.json({ success: true, message: 'Resume deleted.' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Resume = require("../models/Resume");
const path = require("path");

require("dotenv").config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ==============================
   ATS SCORE CALCULATION
================================ */
const calculateAtsScore = (resumeText, jobDescription) => {
  if (!jobDescription || jobDescription.trim().length === 0) return 75;

  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with",
    "by","from","is","are","was","were","be","been","being","have","has",
    "had","do","does","did","will","would","could","should","may","might",
    "shall","can","need","dare","ought","used","able"
  ]);

  const extractKeywords = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
  };

  const jobKeywords = new Set(extractKeywords(jobDescription));
  const resumeWords = new Set(extractKeywords(resumeText));

  if (jobKeywords.size === 0) return 75;

  let matches = 0;
  jobKeywords.forEach(keyword => {
    if (resumeWords.has(keyword)) matches++;
  });

  const score = Math.round((matches / jobKeywords.size) * 100);

  return Math.min(Math.max(score, 20), 99);
};

/* ==============================
   FILE TEXT EXTRACTION
================================ */
const extractText = async (buffer, originalname) => {
  const ext = path.extname(originalname).toLowerCase();

  if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Only PDF and DOCX allowed.");
};

/* ==============================
   GEMINI OPTIMIZATION
================================ */
const optimizeWithGemini = async (resumeText, jobDescription) => {
  const jobContext = jobDescription
    ? `Target Job Description:\n${jobDescription}\n\n`
    : "";

  const prompt = `
Act as a senior HR recruiter and ATS specialist with 15+ years of experience.

${jobContext}
Improve the following resume to score 90%+ for this job description.

Rules:
- Add measurable achievements with numbers or percentages
- Use strong action verbs
- Optimize keywords naturally
- Do NOT fabricate information
- Keep formatting professional
- Output ONLY improved resume in clean plain text
- No markdown
- No explanations

RESUME:
${resumeText}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI optimization failed.");
  }
};

/* ==============================
   CREATE & OPTIMIZE RESUME
================================ */
exports.optimizeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file."
      });
    }

    const { jobDescription = "" } = req.body;

    const originalText = await extractText(
      req.file.buffer,
      req.file.originalname
    );

    if (!originalText || originalText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract valid text from resume."
      });
    }

    const improvedText = await optimizeWithGemini(
      originalText,
      jobDescription
    );

    const atsScore = calculateAtsScore(improvedText, jobDescription);

    const resume = await Resume.create({
      userId: req.user._id,
      originalText,
      improvedText,
      jobDescription,
      atsScore,
      fileName: req.file.originalname,
      fileType: path.extname(req.file.originalname).replace(".", ""),
    });

    return res.status(201).json({
      success: true,
      resume: {
        id: resume._id,
        originalText: resume.originalText,
        improvedText: resume.improvedText,
        jobDescription: resume.jobDescription,
        atsScore: resume.atsScore,
        fileName: resume.fileName,
        createdAt: resume.createdAt,
      }
    });

  } catch (error) {
    console.error("Optimize error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Optimization failed."
    });
  }
};

/* ==============================
   GET USER RESUMES (PAGINATED)
================================ */
exports.getMyResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Resume.countDocuments({
      userId: req.user._id
    });

    const resumes = await Resume.find({
      userId: req.user._id
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-originalText -improvedText");

    res.json({
      success: true,
      resumes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ==============================
   GET SINGLE RESUME
================================ */
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found."
      });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ==============================
   DELETE RESUME
================================ */
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found."
      });
    }

    res.json({
      success: true,
      message: "Resume deleted successfully."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};