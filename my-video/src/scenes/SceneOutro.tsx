import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SceneOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 로고 바운스 등장
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  // CTA 텍스트 페이드인
  const ctaOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [1 * fps, 2 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL 페이드인
  const urlOpacity = interpolate(frame, [2 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 펄스 글로우
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.8]
  );

  // 배경 파티클
  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = ((i * 137.5) % 100);
    const baseY = ((i * 73.7 + frame * 0.3) % 120) - 10;
    const size = 2 + (i % 4);
    const particleOpacity = 0.1 + (i % 5) * 0.05;
    return { x, y: baseY, size, opacity: particleOpacity };
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 배경 파티클 */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(124, 114, 255, 0.5)",
            opacity: p.opacity,
          }}
        />
      ))}

      {/* 글로우 원 */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(124,114,255,${glowIntensity * 0.15}) 0%, transparent 70%)`,
        }}
      />

      <div style={{ textAlign: "center", transform: `scale(${logoScale})` }}>
        {/* 메인 로고 */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: "white",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: -2,
            textShadow: `0 0 ${60 * glowIntensity}px rgba(124, 114, 255, ${glowIntensity})`,
          }}
        >
          REMOTION
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          textAlign: "center",
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          지금 시작하세요
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          textAlign: "center",
          opacity: urlOpacity,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#7c72ff",
            fontFamily: "monospace",
            padding: "12px 32px",
            border: "1px solid rgba(124, 114, 255, 0.3)",
            borderRadius: 12,
            background: "rgba(124, 114, 255, 0.1)",
          }}
        >
          npx create-video@latest
        </div>
      </div>
    </AbsoluteFill>
  );
};
