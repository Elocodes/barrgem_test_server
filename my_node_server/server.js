require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;

// Debug message to check if the API key is loaded
if (!apiKey) {
  console.error('GEMINI_API_KEY is not defined. Please check your .env file.');
  process.exit(1);
} else {
  console.log('GEMINI_API_KEY is loaded successfully');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(bodyParser.json());

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.length === 0) {
    return res.status(400).json({ error: 'Invalid text input' });
  }

  try {
    const prompt = `tell a cute story about:\n${text}`;
    console.log('Prompt being sent to Gemini API:', prompt);

    const request = {
      prompt: [{ text: prompt }]
    };

    const response = await model.generateContent(request);

    // Debug message to check the response from the API
    console.log('Response from Gemini API:', response);

    // Make sure to access the correct part of the response
    const summary = response.generations[0].text;
    console.log('Summary received:', summary);

    res.json({ summary });
  } catch (error) {
    // More detailed error message
    console.error('Error summarizing text:', error.message, error.stack);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
