const fetch = require('node-fetch');
require('dotenv').config();

const KLING_BASE = 'https://api.klingai.com/v1';

async function textToVideo(prompt, options = {}) {
  const {
    negativePrompt = 'blurry, distorted, low quality',
    duration = 5,
    aspectRatio = '16:9',
    mode = 'pro',
    cameraControl = null,
  } = options;

  const body = {
    prompt,
    negative_prompt: negativePrompt,
    duration,
    aspect_ratio: aspectRatio,
    mode,
  };

  if (cameraControl) {
    body.camera_control = cameraControl;
  }

  const response = await fetch(`${KLING_BASE}/videos/text2video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KLING_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Kling error: ${JSON.stringify(result)}`);
  console.log('Kling Task ID:', result.task_id);
  return result.task_id;
}

async function imageToVideo(imageUrl, prompt, options = {}) {
  const { duration = 5, mode = 'pro' } = options;

  const response = await fetch(`${KLING_BASE}/videos/image2video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KLING_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: imageUrl,
      prompt,
      duration,
      mode,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Kling error: ${JSON.stringify(result)}`);
  return result.task_id;
}

async function checkTask(taskId) {
  const response = await fetch(`${KLING_BASE}/videos/tasks/${taskId}`, {
    headers: { 'Authorization': `Bearer ${process.env.KLING_API_KEY}` },
  });
  return response.json();
}

async function waitForResult(taskId, intervalMs = 10000) {
  console.log(`Waiting for task ${taskId}...`);
  while (true) {
    const status = await checkTask(taskId);
    console.log(`  Status: ${status.status}`);
    if (status.status === 'completed') return status;
    if (status.status === 'failed') throw new Error(`Task failed: ${JSON.stringify(status)}`);
    await new Promise(r => setTimeout(r, intervalMs));
  }
}

// Alias for pipeline compatibility
const generateKlingVideo = textToVideo;

module.exports = { textToVideo, generateKlingVideo, imageToVideo, checkTask, waitForResult };
