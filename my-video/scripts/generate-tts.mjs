/**
 * Episode 30: ラストパートナー — OpenAI TTS Generator
 *
 * Usage: node scripts/generate-tts.mjs
 *
 * Generates Japanese narration audio for all 18 shots using OpenAI TTS.
 * Voice: "nova" (warm, gentle female voice suitable for Japanese narration)
 * Model: tts-1-hd (higher quality)
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'episode30', 'audio');

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

// All narration lines per shot
const shots = [
  { id: 1, text: 'ラストパートナー。そんな言葉、私は鼻で笑っていました。' },
  { id: 2, text: 'ところが、あの日。玄関のチャイムが鳴り、ドアを開けた瞬間…' },
  { id: 3, text: 'そこに立っていたのは、もう二度と会うことはないと思っていた、あの人だったのです。' },
  { id: 4, text: '心臓が痛いくらいに跳ね上がり、呼吸の仕方を忘れてしまうほどでした。' },
  { id: 5, text: '東京の郊外にある小さな家で、私は静かに暮らしてきました。' },
  { id: 6, text: '誰にも迷惑をかけず、ひとりで静かに幕を下ろす。それが「品格のある老後」だと信じて疑わなかったのです。' },
  { id: 7, text: '夕食はいつも、スーパーの割引シールのついたお惣菜と冷めたお味噌汁。' },
  { id: 8, text: 'テレビの音が唯一の話し相手でした。' },
  { id: 9, text: 'もし今、このまま目が覚めなかったら、誰が最初に見つけてくれるかしら。' },
  { id: 10, text: 'そんな私の前に現れたのは、学生時代の知人、佐藤さんでした。' },
  { id: 11, text: '最初は戸惑いました。近所の目が気になり、世間体が頭をよぎりました。' },
  { id: 12, text: '二人で近くの公園を歩き、温かいほうじ茶を飲んでいる時…' },
  { id: 13, text: '「もう、ひとりで頑張らなくてもいいんじゃないですか」' },
  { id: 14, text: '誰かに頼ってもいい、誰かと寄り添ってもいい。それは決して恥ずかしいことではないのだと、ようやく気づいたのです。' },
  { id: 15, text: '私たちは今、いわゆる「茶飲み友達」として、穏やかな時間を共有しています。' },
  { id: 16, text: '朝起きて「おはよう」とメッセージを送れる相手がいるだけで、冷え切っていた部屋が、こんなにも温かく感じられるのです。' },
  { id: 17, text: 'ラストパートナーという選択は、自分自身の人生を最後まで愛し抜くための、最高の勇気なのだと思います。' },
  { id: 18, text: '今、孤独を感じているあなたへ。どうか、心の扉を閉ざさないでください。奇跡は、案外すぐそばまで来ているかもしれませんよ。' },
];

async function generateTTS(shot) {
  const filename = `narration-${String(shot.id).padStart(2, '0')}.mp3`;
  const filepath = path.join(OUTPUT_DIR, filename);

  // Skip if already generated
  if (fs.existsSync(filepath)) {
    console.log(`  ⏭️  Shot ${shot.id} audio already exists, skipping.`);
    return;
  }

  console.log(`  🎙️  Generating shot ${shot.id}: "${shot.text.substring(0, 30)}..."`);

  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'nova',
      input: shot.text,
      speed: 0.85, // Slightly slower for emotional narration
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`  ✅ Shot ${shot.id} audio saved: ${filename}`);
  } catch (error) {
    console.error(`  ❌ Shot ${shot.id} failed: ${error.message}`);
  }
}

// Get audio duration using a simple MP3 frame analysis
function getMP3Duration(filepath) {
  const buffer = fs.readFileSync(filepath);
  // Simple estimation: file size / bitrate
  // tts-1-hd outputs ~48kbps MP3
  const fileSizeBytes = buffer.length;
  const estimatedBitrate = 48000; // bits per second
  const durationSec = (fileSizeBytes * 8) / estimatedBitrate;
  return Math.round(durationSec * 10) / 10;
}

async function main() {
  console.log('🎙️  Episode 30: ラストパートナー — TTS Generation');
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`🔊 Total shots: ${shots.length}`);
  console.log(`🗣️  Voice: nova (OpenAI TTS HD, speed 0.85)\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const shot of shots) {
    await generateTTS(shot);
    await new Promise((r) => setTimeout(r, 500));
  }

  // Report durations
  console.log('\n📊 Audio Duration Report:');
  console.log('─'.repeat(50));

  const durations = {};
  let totalDuration = 0;

  for (const shot of shots) {
    const filepath = path.join(OUTPUT_DIR, `narration-${String(shot.id).padStart(2, '0')}.mp3`);
    if (fs.existsSync(filepath)) {
      const dur = getMP3Duration(filepath);
      durations[shot.id] = dur;
      totalDuration += dur;
      console.log(`  Shot ${String(shot.id).padStart(2, '0')}: ~${dur}s`);
    }
  }

  console.log('─'.repeat(50));
  console.log(`  Total narration: ~${Math.round(totalDuration)}s`);
  console.log(`\n✅ Done! Audio files saved to public/episode30/audio/`);

  // Write duration metadata for Remotion to use
  const metaPath = path.join(OUTPUT_DIR, 'durations.json');
  fs.writeFileSync(metaPath, JSON.stringify(durations, null, 2));
  console.log(`📝 Duration metadata: ${metaPath}`);
}

main().catch(console.error);
