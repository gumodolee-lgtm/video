const fetch = require('node-fetch');
require('dotenv').config();

const RUNWAY_BASE = 'https://api.dev.runwayml.com/v1';

async function textToVideo(prompt, options = {}) {
  const {
    model = 'gen3a_turbo',
    duration = 5,
    ratio = '16:9',
    watermark = false,
  } = options;

  const response = await fetch(`${RUNWAY_BASE}/image_to_video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06',
    },
    body: JSON.stringify({
      model,
      promptText: prompt,
      duration,
      ratio,
      watermark,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Runway error: ${JSON.stringify(result)}`);
  console.log('Runway Task ID:', result.id);
  return result.id;
}

async function imageToVideo(imageUrl, prompt, options = {}) {
  const { model = 'gen3a_turbo', duration = 5, ratio = '16:9' } = options;

  const response = await fetch(`${RUNWAY_BASE}/image_to_video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      'Content-Type': 'application/json',
      'X-Runway-Version': '2024-11-06',
    },
    body: JSON.stringify({
      model,
      promptImage: imageUrl,
      promptText: prompt,
      duration,
      ratio,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Runway error: ${JSON.stringify(result)}`);
  return result.id;
}

async function checkTask(taskId) {
  const response = await fetch(`${RUNWAY_BASE}/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
      'X-Runway-Version': '2024-11-06',
    },
  });
  return response.json();
}

async function waitForResult(taskId, intervalMs = 10000) {
  console.log(`Waiting for Runway task ${taskId}...`);
  while (true) {
    const status = await checkTask(taskId);
    console.log(`  Status: ${status.status}`);
    if (status.status === 'SUCCEEDED') return status;
    if (status.status === 'FAILED') throw new Error(`Task failed: ${JSON.stringify(status)}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

module.exports = { textToVideo, imageToVideo, checkTask, waitForResult };
