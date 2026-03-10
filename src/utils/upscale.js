// 4K 업스케일링 유틸리티
// Real-ESRGAN 또는 외부 API를 통한 업스케일

const { execSync } = require('child_process');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function upscaleLocal(inputPath, outputPath, scale = 4) {
  // Real-ESRGAN CLI 사용 (사전 설치 필요)
  // https://github.com/xinntao/Real-ESRGAN
  const cmd = `realesrgan-ncnn-vulkan -i "${inputPath}" -o "${outputPath}" -s ${scale} -n realesrgan-x4plus`;

  try {
    console.log(`Upscaling ${inputPath} → ${scale}x...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Upscaled: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error('Real-ESRGAN not found. Install from: https://github.com/xinntao/Real-ESRGAN');
    throw err;
  }
}

async function upscaleWithComfyUI(inputPath, comfyuiUrl = 'http://127.0.0.1:8188') {
  // ComfyUI의 업스케일 워크플로우 사용
  const workflow = {
    "1": {
      "class_type": "LoadImage",
      "inputs": { "image": path.basename(inputPath) }
    },
    "2": {
      "class_type": "UpscaleModelLoader",
      "inputs": { "model_name": "RealESRGAN_x4plus.pth" }
    },
    "3": {
      "class_type": "ImageUpscaleWithModel",
      "inputs": {
        "upscale_model": ["2", 0],
        "image": ["1", 0]
      }
    },
    "4": {
      "class_type": "SaveImage",
      "inputs": {
        "images": ["3", 0],
        "filename_prefix": "upscaled"
      }
    }
  };

  const response = await fetch(`${comfyuiUrl}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow }),
  });

  const result = await response.json();
  console.log('Upscale queued:', result.prompt_id);
  return result.prompt_id;
}

module.exports = { upscaleLocal, upscaleWithComfyUI };
