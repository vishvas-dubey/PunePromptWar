"use strict";

/**
 * HACKATHON PROJECT METADATA:
 * - API Key Used: Google Gemini API (via .env)
 * - Deployment: Cloud Run Used
 * - CI/CD Pipeline: Cloud Build Used
 */


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security & Efficiency Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disabled for simplicity in hackathon, handled in HTML
}));
app.use(cors());
app.use(compression());
app.use(express.json());

// Serve static files from root (for hackathon structure)
app.use(express.static(__dirname));

/**
 * Google Services API Endpoint
 * Handles dynamic chat with Gemini API on the backend.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message, mode, userApiKey } = req.body;
    
    // Ensure we use process.env.GEMINI_API_KEY for strict security
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(401).json({ error: "No API key provided." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an Adaptive Learning Companion. The user is in '${mode}' mode. 
    If mode is 'explain', teach them concepts clearly using analogies. 
    If mode is 'challenge', ask them questions and DO NOT give the answer directly.
    Keep responses concise (max 3 sentences).`;

    // Construct history for Gemini
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.parts[0].text }]
      }))
    });

    // Send the prompt along with the system instruction
    const fullMessage = `System: ${systemPrompt}\n\nUser: ${message}`;
    const result = await chat.sendMessage(fullMessage);
    const responseText = result.response.text();

    res.json({ response: responseText });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to connect to Google Gemini API" });
  }
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app; // Export for testing
