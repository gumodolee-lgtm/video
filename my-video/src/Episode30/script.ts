// Episode 30: ラストパートナー - Script Data
// Shot duration = narrationStartOffset + audioDuration + TRANSITION_BUFFER
// NO fixed/artificial padding — timing driven entirely by TTS audio

export type KenBurnsEffect = 'zoomIn' | 'zoomOut' | 'panRight' | 'panLeft';

export interface ShotData {
  id: number;
  narration: string;
  imagePrompt: string;
  narrationStartOffset: number;
  audioDuration: number; // actual TTS audio length (ffprobe measured)
  kenBurns: KenBurnsEffect;
  /** Computed: offset + audio + buffer */
  durationInSeconds: number;
}

export interface SceneData {
  id: number;
  title: string;
  titleJa: string;
  shots: ShotData[];
}

export const FPS = 30;
export const TITLE_DURATION = 5;
export const ENDING_DURATION = 15;

/** Seconds of silence after narration ends before next shot fades in */
const TRANSITION_BUFFER = 3;

/** Calculate shot duration from audio timing */
function shotDuration(offset: number, audio: number): number {
  return Math.ceil(offset + audio + TRANSITION_BUFFER);
}

export const EPISODE_INFO = {
  number: 30,
  titleJa: '「"最後のパートナー"なんて言葉、笑ってた。でも…」',
  category: '昭和レトロ・再会・温泉・健康',
  keywords: ['ラストパートナー', '再出発', '孤独'],
  summary: '시니어 로맨스/동반자(라스트 파트너)',
};

// =============================================================================
// Scene 1: 도입부
// =============================================================================
export const scene1: SceneData = {
  id: 1,
  title: '도입부',
  titleJa: '始まり',
  shots: [
    {
      id: 1,
      narration: 'ラストパートナー。そんな言葉、私は鼻で笑っていました。',
      imagePrompt: 'Close-up of 70yo Japanese woman with grey bob, cynical smirk.',
      narrationStartOffset: 1,
      audioDuration: 4.97,
      durationInSeconds: shotDuration(1, 4.97),
      kenBurns: 'zoomIn',
    },
    {
      id: 2,
      narration: 'ところが、あの日。玄関のチャイムが鳴り、ドアを開けた瞬間…',
      imagePrompt: 'Woman opening door, eyes wide in shock.',
      narrationStartOffset: 0.5,
      audioDuration: 5.35,
      durationInSeconds: shotDuration(0.5, 5.35),
      kenBurns: 'panRight',
    },
    {
      id: 3,
      narration:
        'そこに立っていたのは、もう二度と会うことはないと思っていた、あの人だったのです。',
      imagePrompt: 'Over-shoulder shot, silhouette of man at door.',
      narrationStartOffset: 0.5,
      audioDuration: 6.89,
      durationInSeconds: shotDuration(0.5, 6.89),
      kenBurns: 'zoomOut',
    },
    {
      id: 4,
      narration:
        '心臓が痛いくらいに跳ね上がり、呼吸の仕方を忘れてしまうほどでした。',
      imagePrompt: 'Extreme close-up hand clutching chest.',
      narrationStartOffset: 0.5,
      audioDuration: 7.06,
      durationInSeconds: shotDuration(0.5, 7.06),
      kenBurns: 'zoomIn',
    },
  ],
};

// =============================================================================
// Scene 2: 고독의 일상
// =============================================================================
export const scene2: SceneData = {
  id: 2,
  title: '고독의 일상',
  titleJa: '静かな暮らし',
  shots: [
    {
      id: 5,
      narration: '東京の郊外にある小さな家で、私は静かに暮らしてきました。',
      imagePrompt: 'Exterior of small Japanese house, overcast day.',
      narrationStartOffset: 2,
      audioDuration: 5.90,
      durationInSeconds: shotDuration(2, 5.90),
      kenBurns: 'panLeft',
    },
    {
      id: 6,
      narration:
        '誰にも迷惑をかけず、ひとりで静かに幕を下ろす。それが「品格のある老後」だと信じて疑わなかったのです。',
      imagePrompt: 'Woman sitting upright on tatami, sipping tea alone.',
      narrationStartOffset: 2,
      audioDuration: 10.18,
      durationInSeconds: shotDuration(2, 10.18),
      kenBurns: 'zoomIn',
    },
    {
      id: 7,
      narration:
        '夕食はいつも、スーパーの割引シールのついたお惣菜と冷めたお味噌汁。',
      imagePrompt: 'Half-price bento + cold miso soup on wooden table.',
      narrationStartOffset: 2,
      audioDuration: 6.91,
      durationInSeconds: shotDuration(2, 6.91),
      kenBurns: 'panRight',
    },
    {
      id: 8,
      narration: 'テレビの音が唯一の話し相手でした。',
      imagePrompt: 'Woman eating alone, blue TV glow illuminating face.',
      narrationStartOffset: 2,
      audioDuration: 3.77,
      durationInSeconds: shotDuration(2, 3.77),
      kenBurns: 'zoomOut',
    },
    {
      id: 9,
      narration:
        'もし今、このまま目が覚めなかったら、誰が最初に見つけてくれるかしら。',
      imagePrompt: 'Woman lying awake in futon, staring at ceiling.',
      narrationStartOffset: 2,
      audioDuration: 6.94,
      durationInSeconds: shotDuration(2, 6.94),
      kenBurns: 'zoomIn',
    },
  ],
};

// =============================================================================
// Scene 3: 재회와 위로
// =============================================================================
export const scene3: SceneData = {
  id: 3,
  title: '재회와 위로',
  titleJa: '再会と慰め',
  shots: [
    {
      id: 10,
      narration: 'そんな私の前に現れたのは、学生時代の知人、佐藤さんでした。',
      imagePrompt: 'Elderly man with kind eyes at entrance, warm light.',
      narrationStartOffset: 2,
      audioDuration: 5.90,
      durationInSeconds: shotDuration(2, 5.90),
      kenBurns: 'panLeft',
    },
    {
      id: 11,
      narration:
        '最初は戸惑いました。近所の目が気になり、世間体が頭をよぎりました。',
      imagePrompt: 'Woman peering anxiously through lace curtain.',
      narrationStartOffset: 2,
      audioDuration: 7.10,
      durationInSeconds: shotDuration(2, 7.10),
      kenBurns: 'zoomIn',
    },
    {
      id: 12,
      narration: '二人で近くの公園を歩き、温かいほうじ茶を飲んでいる時…',
      imagePrompt: 'Two teacups on table, two elderly hands close.',
      narrationStartOffset: 2,
      audioDuration: 5.90,
      durationInSeconds: shotDuration(2, 5.90),
      kenBurns: 'panRight',
    },
    {
      id: 13,
      narration: '「もう、ひとりで頑張らなくてもいいんじゃないですか」',
      imagePrompt: 'Woman with tear on cheek, relief and release.',
      narrationStartOffset: 2,
      audioDuration: 4.49,
      durationInSeconds: shotDuration(2, 4.49),
      kenBurns: 'zoomOut',
    },
    {
      id: 14,
      narration:
        '誰かに頼ってもいい、誰かと寄り添ってもいい。それは決して恥ずかしいことではないのだと、ようやく気づいたのです。',
      imagePrompt: 'Couple on park bench, hand on hand, autumn leaves.',
      narrationStartOffset: 2,
      audioDuration: 10.13,
      durationInSeconds: shotDuration(2, 10.13),
      kenBurns: 'zoomIn',
    },
  ],
};

// =============================================================================
// Scene 4: 새로운 출발
// =============================================================================
export const scene4: SceneData = {
  id: 4,
  title: '새로운 출발',
  titleJa: '新しい出発',
  shots: [
    {
      id: 15,
      narration:
        '私たちは今、いわゆる「茶飲み友達」として、穏やかな時間を共有しています。',
      imagePrompt: 'Couple eating breakfast together, sunlight in room.',
      narrationStartOffset: 2,
      audioDuration: 7.37,
      durationInSeconds: shotDuration(2, 7.37),
      kenBurns: 'panLeft',
    },
    {
      id: 16,
      narration:
        '朝起きて「おはよう」とメッセージを送れる相手がいるだけで、冷え切っていた部屋が、こんなにも温かく感じられるのです。',
      imagePrompt: 'Woman smiling at smartphone message.',
      narrationStartOffset: 2,
      audioDuration: 10.97,
      durationInSeconds: shotDuration(2, 10.97),
      kenBurns: 'zoomIn',
    },
    {
      id: 17,
      narration:
        'ラストパートナーという選択は、自分自身の人生を最後まで愛し抜くための、最高の勇気なのだと思います。',
      imagePrompt: 'Couple silhouettes on hilltop bench at sunset.',
      narrationStartOffset: 2,
      audioDuration: 10.25,
      durationInSeconds: shotDuration(2, 10.25),
      kenBurns: 'panRight',
    },
    {
      id: 18,
      narration:
        '今、孤独を感じているあなたへ。どうか、心の扉を閉ざさないでください。奇跡は、案外すぐそばまで来ているかもしれませんよ。',
      imagePrompt: 'Woman looking at camera with warm empathetic smile.',
      narrationStartOffset: 2,
      audioDuration: 11.52,
      durationInSeconds: shotDuration(2, 11.52),
      kenBurns: 'zoomOut',
    },
  ],
};

// All scenes in order
export const allScenes: SceneData[] = [scene1, scene2, scene3, scene4];

// All shots flattened
export const allShots: ShotData[] = allScenes.flatMap((s) => s.shots);

// Total duration in seconds (title + shots + ending)
export const TOTAL_DURATION =
  TITLE_DURATION +
  allShots.reduce((sum, s) => sum + s.durationInSeconds, 0) +
  ENDING_DURATION;
