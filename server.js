const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// NewsAPI configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY; // Set in Render env vars
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + NEWS_API_KEY;

// OpenAI configuration for AI assistant
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Set in Render env vars
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Cache for news data
let newsCache = { articles: [] };

// Function to fetch news
async function fetchNews() {
  try {
    const response = await axios.get(NEWS_API_URL);
    newsCache = response.data;
    console.log('News updated at', new Date().toISOString());
  } catch (error) {
    console.error('Error fetching news:', error.message);
  }
}

// Initial fetch
fetchNews();

// Schedule to fetch news every hour
cron.schedule('0 * * * *', fetchNews);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get news
app.get('/api/news', (req, res) => {
  res.json(newsCache);
});

// API endpoint for AI chat
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
