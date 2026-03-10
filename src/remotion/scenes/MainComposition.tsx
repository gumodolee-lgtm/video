import { AbsoluteFill, Sequence, Video, Audio, useCurrentFrame } from 'remotion';
import { FadeTransition } from '../transitions/FadeTransition';

interface Clip {
  type: 'video' | 'image';
  src: string;
  durationInFrames: number;
  startFrom?: number;
}

interface MainCompositionProps {
  clips: Clip[];
  audioSrc?: string;
}

export const MainComposition: React.FC<MainCompositionProps> = ({ clips, audioSrc }) => {
  const frame = useCurrentFrame();
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {clips.map((clip, index) => {
        const from = currentFrame;
        currentFrame += clip.durationInFrames;

        return (
          <Sequence key={index} from={from} durationInFrames={clip.durationInFrames}>
            <FadeTransition durationInFrames={15}>
              {clip.type === 'video' ? (
                <Video
                  src={clip.src}
                  startFrom={clip.startFrom || 0}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <AbsoluteFill>
                  <img
                    src={clip.src}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AbsoluteFill>
              )}
            </FadeTransition>
          </Sequence>
        );
      })}

      {audioSrc && (
        <Audio src={audioSrc} volume={1} />
      )}
    </AbsoluteFill>
  );
};
