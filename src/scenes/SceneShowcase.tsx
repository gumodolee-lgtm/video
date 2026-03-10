import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const SceneShowcase = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 코드 에디터 슬라이드인
  const editorProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });
  const editorX = interpolate(editorProgress, [0, 1], [-600, 0]);

  // 미리보기 화면 슬라이드인
  const previewProgress = spring({
    frame: frame - 0.5 * fps,
    fps,
    config: { damping: 200 },
  });
  const previewX = interpolate(previewProgress, [0, 1], [600, 0]);

  // 타이핑 효과를 위한 코드 텍스트
  const codeText = `const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame, [0, 30], [0, 1]
  );
  return (
    <div style={{ opacity }}>
      Hello Remotion!
    </div>
  );
};`;

  const visibleChars = Math.floor(
    interpolate(frame, [0.8 * fps, 4.5 * fps], [0, codeText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.linear,
    })
  );

  // 미리보기 내부 opacity 애니메이션 (코드 결과물 시뮬레이션)
  const previewTextOpacity = interpolate(
    frame,
    [3 * fps, 4.5 * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 화살표 애니메이션
  const arrowOpacity = interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowScale = spring({
    frame: frame - 2 * fps,
    fps,
    config: { damping: 8 },
  });

  // 아웃 페이드
  const outOpacity = interpolate(frame, [6 * fps, 7 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        justifyContent: "center",
        alignItems: "center",
        opacity: outOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* 코드 에디터 */}
        <div
          style={{
            transform: `translateX(${editorX}px)`,
            width: 700,
            background: "#1e1e2e",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* 에디터 헤더 */}
          <div
            style={{
              padding: "12px 16px",
              background: "#2d2d3f",
              display: "flex",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#28ca42",
              }}
            />
            <div
              style={{
                marginLeft: 16,
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
                fontFamily: "monospace",
              }}
            >
              MyVideo.tsx
            </div>
          </div>
          {/* 코드 내용 */}
          <div
            style={{
              padding: 24,
              fontFamily: "'Courier New', monospace",
              fontSize: 20,
              lineHeight: 1.6,
              color: "#a9b1d6",
              whiteSpace: "pre",
              minHeight: 320,
            }}
          >
            {codeText.slice(0, visibleChars)}
            <span
              style={{
                opacity: frame % 30 < 15 ? 1 : 0,
                color: "#7c72ff",
              }}
            >
              |
            </span>
          </div>
        </div>

        {/* 화살표 */}
        <div
          style={{
            fontSize: 60,
            color: "#7c72ff",
            opacity: arrowOpacity,
            transform: `scale(${arrowScale})`,
          }}
        >
          →
        </div>

        {/* 미리보기 화면 */}
        <div
          style={{
            transform: `translateX(${previewX}px)`,
            width: 500,
            height: 380,
            background: "#0a0a0a",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "white",
              fontFamily: "system-ui, sans-serif",
              opacity: previewTextOpacity,
              textShadow: "0 0 40px rgba(124, 114, 255, 0.6)",
            }}
          >
            Hello Remotion!
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
