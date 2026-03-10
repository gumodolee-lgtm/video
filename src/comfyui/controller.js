// ComfyUI API Controller
// VS Code에서 ComfyUI 워크플로우를 원격 실행 & 모니터링

const WebSocket = require('ws');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const COMFYUI_URL = process.env.COMFYUI_URL || 'http://127.0.0.1:8188';

async function runWorkflow(workflowPath, overrides = {}) {
  const workflow = JSON.parse(
    fs.readFileSync(workflowPath, 'utf-8')
  );

  // Apply prompt overrides to workflow nodes
  for (const [nodeId, inputs] of Object.entries(overrides)) {
    if (workflow[nodeId]) {
      Object.assign(workflow[nodeId].inputs, inputs);
    }
  }

  const response = await fetch(`${COMFYUI_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ComfyUI error: ${err}`);
  }

  const result = await response.json();
  console.log('Queued:', result.prompt_id);
  return result.prompt_id;
}

function monitorProgress(promptId) {
  return new Promise((resolve, reject) => {
    const wsUrl = COMFYUI_URL.replace('http', 'ws') + '/ws';
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => console.log('Connected to ComfyUI WebSocket'));

    ws.on('message', (data) => {
      const msg = JSON.parse(data);

      if (msg.type === 'progress') {
        const pct = Math.round((msg.data.value / msg.data.max) * 100);
        process.stdout.write(`\rProgress: ${pct}% (${msg.data.value}/${msg.data.max})`);
      }

      if (msg.type === 'executed' && msg.data.prompt_id === promptId) {
        console.log('\n완료! 결과물 저장됨');
        ws.close();
        resolve(msg.data);
      }

      if (msg.type === 'execution_error') {
        ws.close();
        reject(new Error(`Execution error: ${JSON.stringify(msg.data)}`));
      }
    });

    ws.on('error', (err) => reject(err));
  });
}

async function runAndWait(workflowPath, overrides = {}) {
  const promptId = await runWorkflow(workflowPath, overrides);
  const result = await monitorProgress(promptId);
  return result;
}

async function getOutputImages(promptId) {
  const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
  const history = await response.json();
  const outputs = history[promptId]?.outputs || {};

  const images = [];
  for (const nodeOutput of Object.values(outputs)) {
    if (nodeOutput.images) {
      for (const img of nodeOutput.images) {
        images.push(`${COMFYUI_URL}/view?filename=${img.filename}&subfolder=${img.subfolder}&type=${img.type}`);
      }
    }
  }
  return images;
}

async function checkStatus() {
  const response = await fetch(`${COMFYUI_URL}/queue`);
  const queue = await response.json();
  return {
    running: queue.queue_running?.length || 0,
    pending: queue.queue_pending?.length || 0,
  };
}

module.exports = { runWorkflow, monitorProgress, runAndWait, getOutputImages, checkStatus };
