const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

async function textToSpeech(text, options = {}) {
  const {
    voiceId = '21m00Tcm4TlvDq8ikWAM', // Rachel (default)
    modelId = 'eleven_multilingual_v2',
    stability = 0.5,
    similarityBoost = 0.75,
    outputPath = null,
  } = options;

  const response = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`ElevenLabs error: ${JSON.stringify(error)}`);
  }

  const buffer = await response.buffer();

  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    console.log(`Audio saved: ${outputPath}`);
    return outputPath;
  }

  return buffer;
}

async function getVoices() {
  const response = await fetch(`${ELEVENLABS_BASE}/voices`, {
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
  });
  const data = await response.json();
  return data.voices;
}

async function soundEffect(text, options = {}) {
  const { durationSeconds = 5, outputPath = null } = options;

  const response = await fetch(`${ELEVENLABS_BASE}/sound-generation`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      duration_seconds: durationSeconds,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`ElevenLabs SFX error: ${JSON.stringify(error)}`);
  }

  const buffer = await response.buffer();

  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    console.log(`SFX saved: ${outputPath}`);
    return outputPath;
  }

  return buffer;
}

// Alias for pipeline compatibility
async function generateVoice(text, options = {}) {
  const outputPath = options.outputPath || './output/narration.mp3';
  return textToSpeech(text, { ...options, outputPath });
}

module.exports = { textToSpeech, generateVoice, getVoices, soundEffect };
