import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";
import { Episode30 } from "./Episode30/Episode30";
import { TOTAL_DURATION, FPS } from "./Episode30/script";

// 30초 = 900프레임 (30fps)
const DEMO_FPS = 30;
const DEMO_DURATION_IN_SECONDS = 30;

export const RemotionRoot = () => {
  return (
    <>
      {/* Episode 30: ラストパートナー (~8分) */}
      <Composition
        id="Episode30"
        component={Episode30}
        durationInFrames={TOTAL_DURATION * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Original demo video */}
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={DEMO_FPS * DEMO_DURATION_IN_SECONDS}
        fps={DEMO_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
