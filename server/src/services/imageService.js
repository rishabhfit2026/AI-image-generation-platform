import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const saveBuffer = (buffer, ext = 'png') => {
  const filename = `${randomUUID()}.${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
  return `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${filename}`;
};

// Pollinations is the default provider: free, no API key required.
const pollinations = async (prompt) => {
  const seed = Math.floor(Math.random() * 1_000_000);
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true`;
};

const stability = async (prompt) => {
  const form = new FormData();
  form.append('prompt', prompt);
  form.append('output_format', 'png');

  const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
      Accept: 'image/*',
    },
    body: form,
  });
  if (!res.ok) throw new Error(`Stability API error: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return saveBuffer(buf, 'png');
};

const huggingface = async (prompt) => {
  const model = process.env.HF_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0';
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: prompt }),
  });
  if (!res.ok) throw new Error(`HuggingFace API error: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return saveBuffer(buf, 'png');
};

const providers = { pollinations, stability, huggingface };

export const generateImage = async (prompt) => {
  const name = (process.env.IMAGE_PROVIDER || 'pollinations').toLowerCase();
  const provider = providers[name] || pollinations;
  return provider(prompt);
};
