const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/api/summarize', (req, res) => {
  console.log('Request received:', req.body);
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'No text provided' });
    return;
  }
  const summary = text.substring(0, 100); // Mock summary
  res.json({ summary });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
  