const fetch = require('node-fetch');
require('dotenv').config();

const HIGGSFIELD_BASE = 'https://api.higgsfield.ai/v1';

async function textToVideo(prompt, options = {}) {
  const {
    duration = 4,
    aspectRatio = '16:9',
    style = 'cinematic',
  } = options;

  const response = await fetch(`${HIGGSFIELD_BASE}/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      duration,
      aspect_ratio: aspectRatio,
      style,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Higgsfield error: ${JSON.stringify(result)}`);
  console.log('Higgsfield Task ID:', result.id);
  return result.id;
}

async function checkTask(taskId) {
  const response = await fetch(`${HIGGSFIELD_BASE}/generations/${taskId}`, {
    headers: { 'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}` },
  });
  return response.json();
}

async function waitForResult(taskId, intervalMs = 10000) {
  console.log(`Waiting for Higgsfield task ${taskId}...`);
  while (true) {
    const status = await checkTask(taskId);
    console.log(`  Status: ${status.status}`);
    if (status.status === 'completed') return status;
    if (status.status === 'failed') throw new Error(`Task failed: ${JSON.stringify(status)}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

module.exports = { textToVideo, checkTask, waitForResult };
