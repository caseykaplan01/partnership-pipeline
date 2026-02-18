const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const STREAK_API_KEY = process.env.STREAK_API_KEY;
const STREAK_BASE_URL = 'https://www.streak.com/api/v1';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function to make Streak API requests
async function streakRequest(endpoint) {
  const response = await fetch(`${STREAK_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(STREAK_API_KEY + ':').toString('base64'),
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Streak API error: ${response.status}`);
  }

  return response.json();
}

// Get all pipelines
app.get('/api/pipelines', async (req, res) => {
  try {
    const pipelines = await streakRequest('/pipelines');
    res.json(pipelines);
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get boxes for a specific pipeline
app.get('/api/pipelines/:pipelineKey/boxes', async (req, res) => {
  try {
    const boxes = await streakRequest(`/pipelines/${req.params.pipelineKey}/boxes`);
    res.json(boxes);
  } catch (error) {
    console.error('Error fetching boxes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific box details
app.get('/api/boxes/:boxKey', async (req, res) => {
  try {
    const box = await streakRequest(`/boxes/${req.params.boxKey}`);
    res.json(box);
  } catch (error) {
    console.error('Error fetching box:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get pipeline details (includes stages)
app.get('/api/pipelines/:pipelineKey', async (req, res) => {
  try {
    const pipeline = await streakRequest(`/pipelines/${req.params.pipelineKey}`);
    res.json(pipeline);
  } catch (error) {
    console.error('Error fetching pipeline:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Streak Portal running at http://localhost:${PORT}`);
});
