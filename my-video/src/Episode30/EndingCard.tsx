import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { EPISODE_INFO } from './script';

interface EndingCardProps {
  fontFamily: string;
}

export const EndingCard: React.FC<EndingCardProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Message fade in (delayed)
  const messageOpacity = interpolate(frame, [fps * 3, fps * 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Next episode preview fade in
  const nextOpacity = interpolate(frame, [fps * 8, fps * 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 1, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Decorative line
  const lineWidth = interpolate(frame, [fps * 1, fps * 3], [0, 400], {
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
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Thank you message */}
        <p
          style={{
            fontFamily,
            fontSize: 36,
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            opacity: messageOpacity,
            letterSpacing: 4,
          }}
        >
          ご視聴ありがとうございました
        </p>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />

        {/* Keywords */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            opacity: messageOpacity,
          }}
        >
          {EPISODE_INFO.keywords.map((kw) => (
            <span
              key={kw}
              style={{
                fontFamily,
                fontSize: 20,
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 20,
                padding: '8px 20px',
              }}
            >
              #{kw}
            </span>
          ))}
        </div>

        {/* Subscribe CTA */}
        <p
          style={{
            fontFamily,
            fontSize: 28,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            marginTop: 16,
            opacity: messageOpacity,
          }}
        >
          チャンネル登録・高評価をお願いします
        </p>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth * 0.6,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            marginTop: 16,
          }}
        />

        {/* Next episode preview */}
        <div
          style={{
            opacity: nextOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 18,
              color: 'rgba(255,255,255,0.35)',
              margin: 0,
              letterSpacing: 3,
            }}
          >
            次回予告
          </p>
          <p
            style={{
              fontFamily,
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            「昭和の喫茶店で、40年ぶりに名前を呼ばれた」
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
