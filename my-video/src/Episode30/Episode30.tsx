import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import {
  loadFont,
  fontFamily as notoSansJPFamily,
} from '@remotion/google-fonts/NotoSansJP';
import { TitleCard } from './TitleCard';
import { EndingCard } from './EndingCard';
import { Shot } from './Shot';
import { allShots, FPS, TITLE_DURATION, ENDING_DURATION } from './script';

// Load only weights 400 & 700; all subsets needed for full Japanese coverage
loadFont();
const fontFamily = notoSansJPFamily;

export const Episode30: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Series>
        {/* Title Card */}
        <Series.Sequence durationInFrames={TITLE_DURATION * FPS}>
          <TitleCard fontFamily={fontFamily} />
        </Series.Sequence>

        {/* All 18 shots */}
        {allShots.map((shot) => (
          <Series.Sequence
            key={shot.id}
            durationInFrames={shot.durationInSeconds * FPS}
          >
            <Shot
              shotId={shot.id}
              narration={shot.narration}
              narrationStartOffset={shot.narrationStartOffset}
              audioDuration={shot.audioDuration}
              kenBurns={shot.kenBurns}
              fontFamily={fontFamily}
            />
          </Series.Sequence>
        ))}

        {/* Ending Card */}
        <Series.Sequence durationInFrames={ENDING_DURATION * FPS}>
          <EndingCard fontFamily={fontFamily} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
