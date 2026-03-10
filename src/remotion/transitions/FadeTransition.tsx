import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

interface FadeTransitionProps {
  children: React.ReactNode;
  durationInFrames?: number;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  durationInFrames = 15,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};
