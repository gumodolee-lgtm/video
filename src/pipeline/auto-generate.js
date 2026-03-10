// src/pipeline/auto-generate.js
// Claude Code한테 "이 스크립트 실행해줘"라고 하면 됨

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const { generateKlingVideo, waitForResult } = require('../api/kling');
const { generateVoice } = require('../api/elevenlabs');
const { createTalkingHead } = require('../api/hedra');
const { renderVideo } = require('../remotion/render');
const presets = require('../prompts/camera-presets.json');

const OUTPUT_DIR = path.resolve(__dirname, '../../output');

async function waitAndDownload(taskId) {
  const result = await waitForResult(taskId);

  // 결과 영상 URL에서 다운로드
  const videoUrl = result.video_url || result.output?.video_url;
  if (!videoUrl) {
    console.log('  ⚠️  No video URL in result, returning task result');
    return result;
  }

  const outputPath = path.join(OUTPUT_DIR, `scene_${taskId}.mp4`);
  const response = await fetch(videoUrl);
  const buffer = await response.buffer();

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`  💾 Downloaded: ${outputPath}`);
  return outputPath;
}

async function createFullVideo(script) {
  console.log('🎬 AI 영상 제작 시작...\n');

  // Step 1: 스크립트 → 장면 분할
  const scenes = script.scenes;

  // Step 2: 각 장면별 영상 생성
  for (const scene of scenes) {
    const camera = presets[scene.cameraPreset];

    if (!camera) {
      throw new Error(`Unknown camera preset: ${scene.cameraPreset}. Available: ${Object.keys(presets).join(', ')}`);
    }

    console.log(`📷 Scene ${scene.id}: ${camera.use_case}`);

    // Kling으로 영상 생성
    const videoId = await generateKlingVideo(
      `${scene.description}, ${camera.prompt}`,
      {
        cameraControl: camera.kling_camera,
        duration: scene.duration,
      }
    );

    scene.videoFile = await waitAndDownload(videoId);
  }

  // Step 3: 음성 생성
  console.log('\n🎙️ 나레이션 생성 중...');
  const voiceFile = await generateVoice(script.narration, {
    outputPath: path.join(OUTPUT_DIR, 'narration.mp3'),
  });

  // Step 4: Remotion으로 최종 합성
  console.log('\n🎬 최종 합성 중...');
  await renderVideo({
    scenes,
    voiceFile,
    outputPath: './output/final.mp4',
  });

  console.log('\n✅ 완성! ./output/final.mp4');
}

// 사용 예시
if (require.main === module) {
  createFullVideo({
    scenes: [
      {
        id: 1,
        description: "korean woman walking through rainy seoul street at night",
        cameraPreset: "crane_down",
        duration: 5,
      },
      {
        id: 2,
        description: "close up of her face with neon reflections",
        cameraPreset: "telephoto_85mm",
        duration: 3,
      },
      {
        id: 3,
        description: "city skyline view from rooftop",
        cameraPreset: "wide_14mm",
        duration: 4,
      },
    ],
    narration: "서울의 밤은 언제나 특별합니다...",
  }).catch(console.error);
}

module.exports = { createFullVideo, waitAndDownload };
