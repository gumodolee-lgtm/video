const fetch = require('node-fetch');
require('dotenv').config();

const HEDRA_BASE = 'https://api.hedra.com/v1';

async function createTalkingHead(audioUrl, imageUrl, options = {}) {
  const {
    aspectRatio = '16:9',
    resolution = '1080p',
  } = options;

  const response = await fetch(`${HEDRA_BASE}/characters/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HEDRA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      image_url: imageUrl,
      aspect_ratio: aspectRatio,
      resolution,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Hedra error: ${JSON.stringify(result)}`);
  console.log('Hedra Task ID:', result.id);
  return result.id;
}

async function textToTalkingHead(text, imageUrl, options = {}) {
  const {
    voice = 'default',
    aspectRatio = '16:9',
  } = options;

  const response = await fetch(`${HEDRA_BASE}/characters/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HEDRA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      image_url: imageUrl,
      voice,
      aspect_ratio: aspectRatio,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Hedra error: ${JSON.stringify(result)}`);
  return result.id;
}

async function checkTask(taskId) {
  const response = await fetch(`${HEDRA_BASE}/tasks/${taskId}`, {
    headers: { 'Authorization': `Bearer ${process.env.HEDRA_API_KEY}` },
  });
  return response.json();
}

async function waitForResult(taskId, intervalMs = 10000) {
  console.log(`Waiting for Hedra task ${taskId}...`);
  while (true) {
    const status = await checkTask(taskId);
    console.log(`  Status: ${status.status}`);
    if (status.status === 'completed') return status;
    if (status.status === 'failed') throw new Error(`Task failed: ${JSON.stringify(status)}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

module.exports = { createTalkingHead, textToTalkingHead, checkTask, waitForResult };
