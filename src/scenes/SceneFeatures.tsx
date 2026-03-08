import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

const FEATURES = [
  { icon: "⚛️", title: "React 기반", desc: "컴포넌트로 영상 제작" },
  { icon: "🎬", title: "프레임 정밀 제어", desc: "useCurrentFrame() 훅" },
  { icon: "🚀", title: "서버 렌더링", desc: "클라우드에서 대량 렌더" },
  { icon: "🎨", title: "무한 커스텀", desc: "CSS + JS로 모든 것 가능" },
];

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  index: number;
}> = ({ icon, title, desc, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 0.4 * fps;

  const cardProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const x = interpolate(cardProgress, [0, 1], [-100, 0]);
  const opacity = interpolate(cardProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity,
        transform: `translateX(${x}px)`,
        padding: "24px 36px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontSize: 56 }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "white",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "system-ui, sans-serif",
            marginTop: 4,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

export const SceneFeatures = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 섹션 제목 애니메이션
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-40, 0]);

  // 아웃 페이드
  const outOpacity = interpolate(frame, [6 * fps, 7 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29, #1a1a3e)",
        padding: "80px 120px",
        justifyContent: "center",
        opacity: outOpacity,
      }}
    >
      {/* 섹션 제목 */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "white",
          fontFamily: "system-ui, sans-serif",
          marginBottom: 60,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        주요 특징
        <div
          style={{
            width: 80,
            height: 4,
            background: "#7c72ff",
            borderRadius: 2,
            marginTop: 16,
          }}
        />
      </div>

      {/* 피처 카드들 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {FEATURES.map((feature, i) => (
          <Sequence
            key={feature.title}
            from={i * 0.4 * fps}
            layout="none"
            premountFor={fps}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              index={i}
            />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};
