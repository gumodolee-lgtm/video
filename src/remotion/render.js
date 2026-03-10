// Remotion CLI 렌더링 래퍼
// scenes + voiceFile → 최종 MP4 출력

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function renderVideo({ scenes, voiceFile, outputPath = './output/final.mp4' }) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Remotion에 전달할 props 생성
  const props = {
    clips: scenes.map(scene => ({
      type: 'video',
      src: scene.videoFile,
      durationInFrames: (scene.duration || 5) * 30, // 30fps 기준
    })),
    audioSrc: voiceFile || undefined,
  };

  const propsPath = path.resolve(dir, 'render-props.json');
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));

  console.log('\n🎬 Remotion 렌더링 시작...');
  console.log(`  Clips: ${props.clips.length}`);
  console.log(`  Audio: ${voiceFile || 'none'}`);
  console.log(`  Output: ${outputPath}`);

  try {
    const totalFrames = props.clips.reduce((sum, c) => sum + c.durationInFrames, 0);
    const cmd = [
      'npx remotion render',
      'src/remotion/Root.tsx',
      'MainComposition',
      `"${outputPath}"`,
      `--props="${propsPath}"`,
      `--frames=0-${totalFrames - 1}`,
    ].join(' ');

    execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '../..') });
    console.log(`\n✅ 렌더링 완료: ${outputPath}`);
  } finally {
    // 임시 props 파일 정리
    if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
  }

  return outputPath;
}

module.exports = { renderVideo };
