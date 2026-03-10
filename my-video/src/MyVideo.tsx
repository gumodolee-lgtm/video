import { AbsoluteFill, Series } from "remotion";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneFeatures } from "./scenes/SceneFeatures";
import { SceneShowcase } from "./scenes/SceneShowcase";
import { SceneStats } from "./scenes/SceneStats";
import { SceneOutro } from "./scenes/SceneOutro";

// 30fps x 30초 = 900프레임
// 장면 배분: 인트로(6초) + 특징(7초) + 쇼케이스(7초) + 통계(5초) + 아웃트로(5초)
const FPS = 30;

export const MyVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <Series>
        <Series.Sequence durationInFrames={6 * FPS}>
          <SceneIntro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={7 * FPS}>
          <SceneFeatures />
        </Series.Sequence>
        <Series.Sequence durationInFrames={7 * FPS}>
          <SceneShowcase />
        </Series.Sequence>
        <Series.Sequence durationInFrames={5 * FPS}>
          <SceneStats />
        </Series.Sequence>
        <Series.Sequence durationInFrames={5 * FPS}>
          <SceneOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
