import { Composition } from 'remotion';
import { MainComposition } from './scenes/MainComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainComposition"
        component={MainComposition}
        durationInFrames={300} // 10초 @ 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          clips: [],
        }}
      />
    </>
  );
};
