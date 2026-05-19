const express = require('express');
const { OpenAI } = require('openai');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.AI_API_KEY,
});

// @route   POST /api/ai/analyze
// @desc    Analyze complaint description
router.post('/analyze', protect, async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const prompt = `
    Analyze the following complaint description and provide the output in strict JSON format. 
    Do not include any extra text.

    Complaint: "${description}"

    Required JSON Output format:
    {
      "priority": "Low | Medium | High",
      "department": "Department Suggestion (e.g., Water, Electricity, Sanitation, etc.)",
      "summary": "Short Summary (1-2 lines)",
      "autoResponse": "Auto-response message for user"
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    let aiResultText = completion.choices[0].message.content;
    let aiData;
    try {
      aiData = JSON.parse(aiResultText);
    } catch (parseError) {
      // Fallback regex parsing if it's not perfect JSON
      console.error("JSON parse failed, returning raw text", parseError);
      return res.status(500).json({ message: 'Failed to parse AI response', rawOutput: aiResultText });
    }

    res.json(aiData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Analysis Failed', error: error.message });
  }
});

module.exports = router;
