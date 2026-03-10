import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";

export const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 배경 그라데이션 회전
  const gradientAngle = interpolate(frame, [0, 6 * fps], [0, 360]);

  // 타이틀 스프링 애니메이션
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 서브타이틀 페이드인 (1초 후)
  const subtitleOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [1 * fps, 2 * fps], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 라인 장식 애니메이션
  const lineWidth = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 아웃 페이드 (마지막 1초)
  const outOpacity = interpolate(frame, [5 * fps, 6 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, #0f0c29, #302b63, #24243e)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: outOpacity,
      }}
    >
      {/* 배경 원형 장식 */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.08)",
          transform: `scale(${titleScale * 1.5}) rotate(${frame * 0.5}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
          transform: `scale(${titleScale * 1.3}) rotate(${-frame * 0.3}deg)`,
        }}
      />

      {/* 메인 타이틀 */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "white",
            letterSpacing: -2,
            fontFamily: "system-ui, sans-serif",
            textShadow: "0 0 60px rgba(100, 100, 255, 0.5)",
          }}
        >
          REMOTION
        </div>

        {/* 장식 라인 */}
        <div
          style={{
            width: lineWidth,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #7c72ff, transparent)",
            margin: "20px auto",
          }}
        />

        {/* 서브타이틀 */}
        <Sequence from={1 * fps} layout="none" premountFor={fps}>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 300,
              fontFamily: "system-ui, sans-serif",
              letterSpacing: 8,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            VIDEO CREATION IN REACT
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
