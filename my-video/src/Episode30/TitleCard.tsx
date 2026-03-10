import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { EPISODE_INFO } from './script';

interface TitleCardProps {
  fontFamily: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in title
  const titleOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [fps * 0.5, fps * 1.5], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade in category
  const categoryOpacity = interpolate(frame, [fps * 2, fps * 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out everything at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Decorative line width
  const lineWidth = interpolate(frame, [fps * 1, fps * 2], [0, 300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0a0a14 0%, #1a1020 50%, #0a0a14 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Episode number */}
        <p
          style={{
            fontFamily,
            fontSize: 24,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 6,
            margin: 0,
            opacity: categoryOpacity,
          }}
        >
          EPISODE {EPISODE_INFO.number}
        </p>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontFamily,
            fontSize: 56,
            color: '#ffffff',
            textAlign: 'center',
            margin: 0,
            maxWidth: 1400,
            lineHeight: 1.5,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {EPISODE_INFO.titleJa}
        </h1>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Category */}
        <p
          style={{
            fontFamily,
            fontSize: 22,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            opacity: categoryOpacity,
            letterSpacing: 4,
          }}
        >
          {EPISODE_INFO.category}
        </p>
      </div>
    </AbsoluteFill>
  );
};
