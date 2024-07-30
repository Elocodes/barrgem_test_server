const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/summarize', async (req, res) => {
  console.log('Request received:', req.body);
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'No text provided' });
    return;
  }

  try {
    const geminiResponse = await axios.post('https://api.gemini.com/summarize', {
      text: text
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const summary = geminiResponse.data.summary;  // Adjust this according to the actual response structure of the Gemini API

    res.json({ summary });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Error summarizing text' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
