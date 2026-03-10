const fetch = require('node-fetch');
require('dotenv').config();

const PIKA_BASE = 'https://api.pika.art/v1';

async function textToVideo(prompt, options = {}) {
  const {
    negativePrompt = 'blurry, distorted',
    style = 'cinematic',
    aspectRatio = '16:9',
    fps = 24,
  } = options;

  const response = await fetch(`${PIKA_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      negative_prompt: negativePrompt,
      style,
      aspect_ratio: aspectRatio,
      fps,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Pika error: ${JSON.stringify(result)}`);
  console.log('Pika Task ID:', result.id);
  return result.id;
}

async function checkTask(taskId) {
  const response = await fetch(`${PIKA_BASE}/tasks/${taskId}`, {
    headers: { 'Authorization': `Bearer ${process.env.PIKA_API_KEY}` },
  });
  return response.json();
}

async function waitForResult(taskId, intervalMs = 8000) {
  console.log(`Waiting for Pika task ${taskId}...`);
  while (true) {
    const status = await checkTask(taskId);
    console.log(`  Status: ${status.status}`);
    if (status.status === 'completed') return status;
    if (status.status === 'failed') throw new Error(`Task failed: ${JSON.stringify(status)}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

module.exports = { textToVideo, checkTask, waitForResult };
