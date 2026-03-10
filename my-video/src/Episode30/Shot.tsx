import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { KenBurnsEffect } from './script';

const USE_PLACEHOLDER = false;

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  warm: 'linear-gradient(135deg, #2c1810 0%, #4a2c1a 50%, #8b6914 100%)',
  cold: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 50%, #2a3a5a 100%)',
  hope: 'linear-gradient(135deg, #1a2a10 0%, #3a4a2a 50%, #6a7a4a 100%)',
  dark: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2a 50%, #2a2a3a 100%)',
};

function getShotMood(shotId: number): string {
  if (shotId <= 4) return 'warm';
  if (shotId <= 9) return 'cold';
  if (shotId <= 14) return 'warm';
  return 'hope';
}

interface ShotProps {
  shotId: number;
  narration: string;
  narrationStartOffset: number;
  audioDuration: number; // actual TTS duration in seconds
  kenBurns: KenBurnsEffect;
  fontFamily: string;
}

export const Shot: React.FC<ShotProps> = ({
  shotId,
  narration,
  narrationStartOffset,
  audioDuration,
  kenBurns,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;
  const fadeFrames = Math.round(fps * 0.8);

  // --- Shot fade in/out ---
  const shotOpacity = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Ken Burns transform ---
  let transform = '';
  switch (kenBurns) {
    case 'zoomIn': {
      const s = interpolate(progress, [0, 1], [1.0, 1.15]);
      transform = `scale(${s})`;
      break;
    }
    case 'zoomOut': {
      const s = interpolate(progress, [0, 1], [1.15, 1.0]);
      transform = `scale(${s})`;
      break;
    }
    case 'panRight': {
      const tx = interpolate(progress, [0, 1], [0, -5]);
      transform = `scale(1.1) translateX(${tx}%)`;
      break;
    }
    case 'panLeft': {
      const tx = interpolate(progress, [0, 1], [-5, 0]);
      transform = `scale(1.1) translateX(${tx}%)`;
      break;
    }
  }

  // --- Subtitle timing (synced to actual audio duration) ---
  const offsetFrames = Math.round(narrationStartOffset * fps);
  const narrationEndFrame = offsetFrames + Math.round(audioDuration * fps);
  const subtitleFade = Math.round(fps * 0.5);

  const subtitleOpacity = interpolate(
    frame,
    [
      offsetFrames,
      offsetFrames + subtitleFade,
      narrationEndFrame,
      narrationEndFrame + subtitleFade,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const imagePath = `episode30/shot-${String(shotId).padStart(2, '0')}.png`;
  const audioPath = `episode30/audio/narration-${String(shotId).padStart(2, '0')}.mp3`;
  const mood = getShotMood(shotId);

  return (
    <AbsoluteFill style={{ opacity: shotOpacity, backgroundColor: '#000' }}>
      {/* Narration audio — starts after offset */}
      <Sequence from={offsetFrames}>
        <Audio src={staticFile(audioPath)} volume={1} />
      </Sequence>

      {/* Image layer with Ken Burns */}
      <AbsoluteFill
        style={{
          transform,
          transformOrigin: 'center center',
        }}
      >
        {USE_PLACEHOLDER ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: PLACEHOLDER_GRADIENTS[mood] || PLACEHOLDER_GRADIENTS.dark,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: 48,
                color: 'rgba(255,255,255,0.15)',
                fontWeight: 700,
              }}
            >
              SHOT {shotId}
            </span>
          </div>
        ) : (
          <Img
            src={staticFile(imagePath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </AbsoluteFill>

      {/* Subtle vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Subtitle bar */}
      {narration && (
        <div
          style={{
            position: 'absolute',
            bottom: '6%',
            left: '5%',
            right: '5%',
            opacity: subtitleOpacity,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              borderRadius: 8,
              padding: '16px 32px',
              maxWidth: '85%',
            }}
          >
            <p
              style={{
                fontFamily,
                fontSize: 42,
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.6,
                margin: 0,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                letterSpacing: 1,
              }}
            >
              {narration}
            </p>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
