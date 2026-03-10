/**
 * Episode 30: ラストパートナー — DALL-E 3 Image Generator
 *
 * Usage: node scripts/generate-images.mjs [--force] [--only=1,2,3]
 *   --force   : Regenerate even if file exists
 *   --only=N  : Only generate specific shot IDs (comma-separated)
 *
 * DALL-E 3 HD 1792x1024 (~$0.12/image)
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'episode30');

// CLI args
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1]?.split(',').map(Number) || null;

// Load .env
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// =============================================================================
// CONSISTENCY RULES — Character Sheets & Art Direction
// =============================================================================

/**
 * 주인공 (Female Protagonist)
 * - 이름: 明子 (아키코) — 프롬프트에 이름은 사용하지 않고, 외모 묘사만 사용
 * - 모든 shot에서 동일 인물로 인식되도록 상세 묘사
 */
const PROTAGONIST = [
  'A 70-year-old Japanese woman',
  'short silver-grey bob haircut just above the jawline with straight bangs',
  'thin oval face with prominent cheekbones and gentle wrinkles',
  'dark brown eyes',
  'wearing a warm beige chunky-knit cardigan over a cream cotton blouse',
  'petite build, about 155cm tall',
  'no glasses, no earrings, no makeup',
].join(', ');

/**
 * 남성 캐릭터 (Male Character — 佐藤さん)
 * - Scene 3, 4에서 등장
 */
const MALE_CHARACTER = [
  'An 80-year-old Japanese man',
  'neatly combed silver-white hair parted to the side',
  'round gentle face with deep smile lines and kind dark eyes',
  'wearing a warm tan wool overcoat over a dark navy sweater and white collared shirt',
  'average build, about 168cm tall',
  'no glasses, clean-shaven',
].join(', ');

/**
 * 공통 아트 디렉션 (Applied to ALL shots)
 * - 일관된 비주얼 톤 유지
 */
const ART_DIRECTION = [
  'Photorealistic cinematic photograph',
  'shot on 35mm Kodak Portra 400 film stock',
  'natural warm color grading with slightly muted tones',
  'shallow depth of field with soft bokeh',
  'subtle film grain texture',
  'no text, no watermarks, no logos, no UI elements',
  'no cartoon, no illustration, no anime style',
  'Japanese residential setting',
].join('. ') + '. ';

/**
 * 씬별 조명/무드 규칙
 */
const SCENE_MOOD = {
  // Scene 1: 도입부 — 따뜻한 오후 빛, 드라마틱한 명암
  intro: 'Warm golden afternoon sunlight, high contrast between light and shadow, dramatic cinematic lighting. ',
  // Scene 2: 고독 — 차갑고 어둡고 쓸쓸한
  solitude: 'Cool desaturated tones, dim domestic lighting, muted colors emphasizing loneliness and stillness. ',
  // Scene 3: 재회 — 따뜻해지는 빛, 골든아워
  reunion: 'Gradually warming light, soft golden hour glow, gentle lens flare hints, emotional warmth returning. ',
  // Scene 4: 새 출발 — 밝고 희망적인 아침/석양 빛
  newStart: 'Bright warm morning light or golden sunset, vivid but not oversaturated colors, hopeful and uplifting atmosphere. ',
};

/**
 * 주인공 집 인테리어 일관성 규칙
 */
const HOME_INTERIOR = [
  'Traditional Japanese home interior',
  'tatami floors with dark wooden borders',
  'shoji paper sliding doors',
  'minimal furnishings',
  'warm-toned wooden surfaces',
  'small low dining table',
  'a modest older TV in the corner',
  'tidy but lived-in',
].join(', ') + '. ';

// =============================================================================
// SHOT DEFINITIONS
// =============================================================================

const shots = [
  // ── Scene 1: 도입부 ──
  {
    id: 1,
    scene: 'intro',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `${PROTAGONIST}. Close-up portrait of her sitting in her living room. ${HOME_INTERIOR}` +
      'She has a cynical, dismissive smirk on her face — slightly mocking expression. ' +
      'She is looking slightly away from the camera to the left. ' +
      'Soft natural indoor light from a window behind her creates rim lighting on her silver hair.',
  },
  {
    id: 2,
    scene: 'intro',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `${PROTAGONIST}. Close-up of her face as she opens a dark wooden front door. ` +
      'Her eyes are wide open in extreme shock and disbelief, mouth slightly open. ' +
      'Bright afternoon sunlight from outside hits her face dramatically, creating high contrast. ' +
      'One hand gripping the door handle, the other hand raised near her face in surprise.',
  },
  {
    id: 3,
    scene: 'intro',
    usesProtagonist: true,
    usesMale: true,
    prompt:
      `Over-the-shoulder shot from behind ${PROTAGONIST}. ` +
      'She is standing at the open front door, seen from behind. Her right hand is gripping the wooden door frame tightly. ' +
      `In the doorway, backlit by bright sunlight, stands a silhouette of ${MALE_CHARACTER}. ` +
      'The man is slightly out of focus. Dramatic backlit composition with strong light-shadow contrast.',
  },
  {
    id: 4,
    scene: 'intro',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Extreme close-up on the chest and hand of ${PROTAGONIST}. ` +
      'Her hand is clutching her chest over her heart — knuckles white with tension. ' +
      'The warm beige chunky-knit cardigan is clearly visible. ' +
      'Cinematic side lighting creating dramatic shadows. Shallow depth of field, only the hand in sharp focus.',
  },

  // ── Scene 2: 고독의 일상 ──
  {
    id: 5,
    scene: 'solitude',
    usesProtagonist: false,
    usesMale: false,
    prompt:
      'A wide exterior photograph of a small, older Japanese detached house with a dark tiled roof. ' +
      'Quiet Tokyo suburban residential street on a cloudy overcast afternoon. No people visible. ' +
      'Modest front garden with a few potted plants and a small mailbox. Concrete block wall. ' +
      'Peaceful but deeply solitary atmosphere. Nostalgic 1990s Japanese film aesthetic. ' +
      'Muted desaturated colors, overcast flat lighting.',
  },
  {
    id: 6,
    scene: 'solitude',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Medium shot of ${PROTAGONIST}. ${HOME_INTERIOR}` +
      'She is sitting perfectly upright in seiza position on a zabuton cushion on the tatami floor. ' +
      'Holding a dark ceramic yunomi tea cup with both hands at chest level. ' +
      'Her expression is stoic, dignified, and emotionally guarded. Looking straight ahead at nothing. ' +
      'Afternoon light filtering softly through shoji doors behind her.',
  },
  {
    id: 7,
    scene: 'solitude',
    usesProtagonist: false,
    usesMale: false,
    prompt:
      'Detailed close-up still life photograph on a simple wooden dining table. ' +
      'A plastic supermarket bento container (containing fried items and rice) with a bright yellow Japanese half-price discount sticker (半額). ' +
      'Next to it, a dark red-brown lacquer bowl of miso soup — completely cold, no steam rising. ' +
      'A single pair of wooden chopsticks resting on a small ceramic hashioki (chopstick rest). ' +
      'Dim warm domestic light from a single pendant lamp above. Lonely dinner-for-one setting.',
  },
  {
    id: 8,
    scene: 'solitude',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Medium profile shot of ${PROTAGONIST} eating alone at a small wooden dining table. ` +
      'Nighttime. The room is very dark — the only light source is the cool blue-white flickering glow ' +
      'of a television screen positioned off-camera to the left, illuminating the left side of her lonely face. ' +
      'Her right side is in deep shadow. She is eating slowly, mechanically. Dark, atmospheric, melancholic.',
  },
  {
    id: 9,
    scene: 'solitude',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Intimate overhead-angle shot (bird's eye view) of ${PROTAGONIST} lying awake in traditional Japanese futon bedding ` +
      'on a tatami floor at night. White futon with a thin navy blue blanket. ' +
      'She is staring up at the ceiling with a worried, introspective expression — eyes wide open. ' +
      'Still wearing her beige cardigan as if she never changed for bed. ' +
      'Soft pale moonlight filtering through a translucent shoji paper sliding window on one side.',
  },

  // ── Scene 3: 재회와 위로 ──
  {
    id: 10,
    scene: 'reunion',
    usesProtagonist: false,
    usesMale: true,
    prompt:
      `Medium shot portrait of ${MALE_CHARACTER}. ` +
      'He is standing at the entrance genkan area of a Japanese house, smiling gently with warmth. ' +
      'Warm golden afternoon sunlight illuminates him from behind and to the side, creating a warm halo effect. ' +
      'The traditional wooden entrance and shoe area are visible around him. He looks kind and non-threatening.',
  },
  {
    id: 11,
    scene: 'reunion',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Interior shot of ${PROTAGONIST} peering anxiously through a white lace curtain at a window. ` +
      `${HOME_INTERIOR}` +
      'She is looking out nervously at the quiet residential street, one hand pulling the curtain aside slightly. ' +
      'Her face is partially obscured by the curtain pattern, showing deep worry about being watched by neighbors. ' +
      'Natural daylight from the window illuminates her worried face.',
  },
  {
    id: 12,
    scene: 'reunion',
    usesProtagonist: false,
    usesMale: false,
    prompt:
      'Intimate close-up shot of two traditional Japanese yunomi ceramic teacups on a worn wooden cafe table. ' +
      'The cups contain warm hojicha roasted tea — gentle wisps of steam rising. ' +
      "Two elderly hands are resting on the table near the cups — one man's hand (larger, weathered) " +
      "and one woman's hand (smaller, delicate with thin fingers). " +
      'The hands are very close together but not quite touching — a moment of hesitation and tenderness. ' +
      'Warm afternoon golden sunlight from a window. Shallow depth of field.',
  },
  {
    id: 13,
    scene: 'reunion',
    usesProtagonist: true,
    usesMale: true,
    prompt:
      `Close-up on the face of ${PROTAGONIST}. ` +
      'A single tear is rolling down her left cheek. ' +
      'Her expression is a profound mix of relief, emotional release, and vulnerability — not sadness but letting go. ' +
      `In the blurred background, ${MALE_CHARACTER} is partially visible, looking at her with gentle concern. ` +
      'Soft warm side lighting from the left. Extremely emotional and intimate moment.',
  },
  {
    id: 14,
    scene: 'reunion',
    usesProtagonist: true,
    usesMale: true,
    prompt:
      `Medium two-shot of ${PROTAGONIST} and ${MALE_CHARACTER} sitting together on a weathered wooden park bench. ` +
      'Autumn setting with red and golden fallen maple leaves on the ground around the bench. ' +
      "The man has gently placed his right hand on top of the woman's left hand resting on the bench between them. " +
      'She is looking down at their touching hands with a peaceful, accepting expression. ' +
      'Warm golden hour sunlight. Japanese park with trees in background.',
  },

  // ── Scene 4: 새로운 출발 ──
  {
    id: 15,
    scene: 'newStart',
    usesProtagonist: true,
    usesMale: true,
    prompt:
      `Bright, cheerful photograph of ${PROTAGONIST} and ${MALE_CHARACTER} sitting opposite each other ` +
      `at a small wooden dining table in her home. ${HOME_INTERIOR}` +
      'Both are genuinely smiling as they share a simple Japanese breakfast — bowls of white rice, miso soup, grilled fish, pickled vegetables. ' +
      'Bright warm morning sunlight streams through a window, filling the room with warmth. ' +
      'The atmosphere is completely different from the lonely dinner scenes — alive and warm.',
  },
  {
    id: 16,
    scene: 'newStart',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Close-up of the face of ${PROTAGONIST}. ` +
      'Her eyes are crinkled with a warm genuine smile — the happiest expression we have seen from her. ' +
      'She is looking down at a smartphone held in both hands. ' +
      'The soft warm glow of the phone screen reflects slightly on her chin. ' +
      'She appears to be reading a message that makes her deeply happy. ' +
      'Warm indoor morning light from behind. Background softly blurred.',
  },
  {
    id: 17,
    scene: 'newStart',
    usesProtagonist: true,
    usesMale: true,
    prompt:
      'Wide cinematic landscape photograph. Two elderly people — a woman with short grey hair in a beige cardigan ' +
      'and a man in a tan coat — sitting closely together on a wooden bench on a grassy hilltop. ' +
      'Seen from behind as small silhouettes. They are overlooking a vast Japanese cityscape far below. ' +
      'Breathtaking golden hour sunset sky with dramatic orange, gold and purple clouds. ' +
      'Extremely peaceful and hopeful final chapter composition. Wide 35mm lens perspective.',
  },
  {
    id: 18,
    scene: 'newStart',
    usesProtagonist: true,
    usesMale: false,
    prompt:
      `Medium close-up portrait of ${PROTAGONIST}. ` +
      'She is looking directly into the camera with a gentle, encouraging, deeply empathetic smile. ' +
      'Her eyes are kind, warm, and slightly glistening — as if speaking directly to the viewer with compassion. ' +
      'Soft diffused warm lighting from the front-left. ' +
      'Slightly shallow depth of field with a warm-toned blurred interior background. ' +
      'This is the final shot — her expression should convey: "everything will be alright."',
  },
];

// =============================================================================
// IMAGE GENERATION
// =============================================================================

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    protocol
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          downloadImage(response.headers.location, filepath)
            .then(resolve)
            .catch(reject);
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function generateImage(shot) {
  const filename = `shot-${String(shot.id).padStart(2, '0')}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Skip if already generated (unless --force)
  if (!FORCE && fs.existsSync(filepath)) {
    console.log(`  ⏭️  Shot ${shot.id} already exists, skipping. (use --force to regenerate)`);
    return;
  }

  // Build final prompt: Art Direction + Scene Mood + Shot-specific prompt
  const sceneMood = SCENE_MOOD[shot.scene] || '';
  const fullPrompt = ART_DIRECTION + sceneMood + shot.prompt;

  console.log(`  🎨 Generating shot ${shot.id} [${shot.scene}]...`);
  console.log(`     Characters: ${shot.usesProtagonist ? '👩 ' : ''}${shot.usesMale ? '👨 ' : ''}${!shot.usesProtagonist && !shot.usesMale ? '🏠 (no people)' : ''}`);

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural',
    });

    const imageUrl = response.data[0].url;
    await downloadImage(imageUrl, filepath);
    console.log(`  ✅ Shot ${shot.id} saved: ${filename}`);

    // Save prompt metadata for reference
    const revisedPrompt = response.data[0].revised_prompt;
    const metaPath = path.join(OUTPUT_DIR, `shot-${String(shot.id).padStart(2, '0')}.txt`);
    fs.writeFileSync(
      metaPath,
      [
        `Scene: ${shot.scene}`,
        `Protagonist: ${shot.usesProtagonist}`,
        `Male character: ${shot.usesMale}`,
        '',
        '--- Original Prompt ---',
        fullPrompt,
        '',
        '--- DALL-E Revised Prompt ---',
        revisedPrompt || '(none)',
        '',
      ].join('\n'),
    );
  } catch (error) {
    console.error(`  ❌ Shot ${shot.id} failed: ${error.message}`);
    const errorPath = path.join(OUTPUT_DIR, `shot-${String(shot.id).padStart(2, '0')}.error`);
    fs.writeFileSync(errorPath, error.message);
  }
}

async function main() {
  const targetShots = ONLY ? shots.filter((s) => ONLY.includes(s.id)) : shots;

  console.log('🎬 Episode 30: ラストパートナー — Image Generation');
  console.log('─'.repeat(60));
  console.log('📋 Consistency Rules:');
  console.log(`   👩 Protagonist: 70yo woman, grey bob, beige cardigan`);
  console.log(`   👨 Male (佐藤): 80yo man, silver hair, tan overcoat`);
  console.log(`   🎬 Style: 35mm Kodak Portra 400, natural warm grading`);
  console.log(`   🏠 Setting: Traditional Japanese home, tatami/shoji`);
  console.log('─'.repeat(60));
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📸 Shots to generate: ${targetShots.length}/${shots.length}`);
  console.log(`🔄 Force regenerate: ${FORCE}`);
  console.log(`💰 Max cost: ~$${(targetShots.length * 0.12).toFixed(2)}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const shot of targetShots) {
    await generateImage(shot);
    await new Promise((r) => setTimeout(r, 2000));
  }

  const generated = targetShots.filter((s) =>
    fs.existsSync(path.join(OUTPUT_DIR, `shot-${String(s.id).padStart(2, '0')}.png`)),
  );
  console.log(`\n🏁 Done! ${generated.length}/${targetShots.length} images generated.`);

  if (ONLY) {
    console.log(`\n💡 Regenerated specific shots: ${ONLY.join(', ')}`);
    console.log('   Review in Remotion Studio to check consistency with other shots.');
  }
}

main().catch(console.error);
