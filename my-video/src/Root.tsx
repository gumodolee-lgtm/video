import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

// 30초 = 900프레임 (30fps)
const FPS = 30;
const DURATION_IN_SECONDS = 30;

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={FPS * DURATION_IN_SECONDS}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
