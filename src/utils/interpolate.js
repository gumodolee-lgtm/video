// 프레임 보간 유틸리티
// RIFE 또는 외부 API를 통한 프레임 보간 (24fps → 60fps)

const { execSync } = require('child_process');
const path = require('path');

async function interpolateLocal(inputPath, outputPath, targetFps = 60) {
  // RIFE (Real-Time Intermediate Flow Estimation) CLI 사용
  // https://github.com/hzwer/Practical-RIFE
  const cmd = `rife-ncnn-vulkan -i "${inputPath}" -o "${outputPath}" -m rife-v4.6 -n ${targetFps}`;

  try {
    console.log(`Interpolating ${inputPath} → ${targetFps}fps...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Interpolated: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error('RIFE not found. Install from: https://github.com/hzwer/Practical-RIFE');
    throw err;
  }
}

async function interpolateWithFFmpeg(inputPath, outputPath, targetFps = 60) {
  // FFmpeg minterpolate 필터 사용 (GPU 불필요, 품질 낮음)
  const cmd = `ffmpeg -i "${inputPath}" -filter:v "minterpolate=fps=${targetFps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -y "${outputPath}"`;

  try {
    console.log(`FFmpeg interpolating → ${targetFps}fps...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Interpolated: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error('FFmpeg not found. Install from: https://ffmpeg.org');
    throw err;
  }
}

module.exports = { interpolateLocal, interpolateWithFFmpeg };
