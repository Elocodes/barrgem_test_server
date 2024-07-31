require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Ensure your API key is stored securely, e.g., using env variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/api/summarize', async (req, res) => {
  console.log('Request received:', req.body);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const result = await model.generateContent({ prompt: text });
    const response = await result.response;
    const summary = response.text();
    console.log('Summary:', summary);
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing text:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
