import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

const STATS = [
  { value: "20K+", label: "GitHub Stars" },
  { value: "1M+", label: "월간 다운로드" },
  { value: "100+", label: "컨트리뷰터" },
  { value: "∞", label: "가능성" },
];

const StatItem: React.FC<{
  value: string;
  label: string;
  index: number;
}> = ({ value, label, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 0.3 * fps;

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          color: "#7c72ff",
          fontFamily: "system-ui, sans-serif",
          textShadow: "0 0 40px rgba(124, 114, 255, 0.4)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "system-ui, sans-serif",
          marginTop: 8,
          fontWeight: 400,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SceneStats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 아웃 페이드
  const outOpacity = interpolate(frame, [4 * fps, 5 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63)",
        justifyContent: "center",
        alignItems: "center",
        opacity: outOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 100,
          alignItems: "center",
        }}
      >
        {STATS.map((stat, i) => (
          <Sequence
            key={stat.label}
            from={i * 0.3 * fps}
            layout="none"
            premountFor={fps}
          >
            <StatItem value={stat.value} label={stat.label} index={i} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};
