import * as THREE from 'three';
import { card } from '@/data/content';

const INK = '#0e0e10';
const PAPER = '#ecebe6';
const MUTED = '#a4a39d';
const ACCENT = '#f2b705';

const SANS = '"Schibsted Grotesk Variable", system-ui, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, anisotropy = 16) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  t.needsUpdate = true;
  return t;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}

export async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load(`800 80px ${SANS}`),
      document.fonts.load(`500 30px ${SANS}`),
      document.fonts.load(`400 26px ${MONO}`),
    ]);
  } catch {
    /* fall back to system fonts */
  }
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Card faces are 1024 x 1440 (same ratio as the 1.6 x 2.25 card). Corners are transparent. */
export async function makeCardFaces() {
  const W = 1024;
  const H = 1440;
  const R = 46; // 0.09 world units of 2.0 wide = 46px of 1024
  const logo = await loadImage('/logo-mark.png');
  // Optional: put a photo at public/photo.jpg and set NEXT_PUBLIC_CARD_PHOTO=1 to print it on the card.
  const photo = process.env.NEXT_PUBLIC_CARD_PHOTO === '1' ? await loadImage('/photo.jpg') : null;

  // ---------- front ----------
  const f = canvas(W, H);
  const ctx = f.ctx;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  roundRect(ctx, 0, 0, W, H, R);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1d1d22');
  g.addColorStop(1, INK);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // faint ruled lines, like graph paper
  ctx.strokeStyle = 'rgba(236,235,230,0.045)';
  ctx.lineWidth = 2;
  for (let y = 120; y < H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // header strip
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 150, W, 10);
  ctx.fillStyle = MUTED;
  ctx.font = `400 28px ${MONO}`;
  ctx.textBaseline = 'alphabetic';
  spaced(ctx, card.kicker, 64, 220, 4);

  // mark or photo
  if (photo) {
    const bx = 64, by = 270, bw = W - 128, bh = 520;
    ctx.save();
    roundRect(ctx, bx, by, bw, bh, 22);
    ctx.clip();
    const s = Math.max(bw / photo.width, bh / photo.height);
    ctx.drawImage(photo, bx + (bw - photo.width * s) / 2, by + (bh - photo.height * s) / 2, photo.width * s, photo.height * s);
    ctx.restore();
    if (logo) ctx.drawImage(logo, W - 64 - 48, 176, 48, 48 * (logo.height / logo.width));
  } else if (logo) {
    const lw = 250;
    const lh = lw * (logo.height / logo.width);
    ctx.drawImage(logo, 64, 300, lw, lh);
  }

  // name
  const nameY = 880;
  ctx.fillStyle = PAPER;
  ctx.font = `800 128px ${SANS}`;
  ctx.fillText(card.nameLines[0], 60, nameY);
  ctx.fillText(card.nameLines[1], 60, nameY + 128);

  // role
  ctx.fillStyle = MUTED;
  ctx.font = `500 38px ${SANS}`;
  ctx.fillText(card.role, 64, nameY + 214);
  ctx.fillText(card.skills, 64, nameY + 262);

  // footer
  ctx.fillStyle = 'rgba(236,235,230,0.18)';
  ctx.fillRect(64, H - 190, W - 128, 2);
  ctx.fillStyle = PAPER;
  ctx.font = `400 28px ${MONO}`;
  spaced(ctx, card.school, 64, H - 130, 3);
  ctx.fillStyle = MUTED;
  spaced(ctx, card.program, 64, H - 84, 3);
  ctx.restore();

  // ---------- back ----------
  const b = canvas(W, H);
  const bx = b.ctx;
  bx.save();
  roundRect(bx, 0, 0, W, H, R);
  bx.clip();
  bx.fillStyle = INK;
  bx.fillRect(0, 0, W, H);
  if (logo) {
    bx.globalAlpha = 0.07;
    const lw = 150;
    const lh = lw * (logo.height / logo.width);
    for (let y = 40; y < H; y += lh + 70) {
      for (let x = 40; x < W; x += lw + 70) {
        bx.drawImage(logo, x + (((y / (lh + 70)) | 0) % 2 ? 110 : 0), y, lw, lh);
      }
    }
    bx.globalAlpha = 1;
  }
  bx.fillStyle = ACCENT;
  bx.fillRect(64, 520, 96, 10);
  bx.fillStyle = PAPER;
  bx.font = `800 96px ${SANS}`;
  bx.fillText(card.backTitle[0], 60, 660);
  bx.fillText(card.backTitle[1], 60, 760);
  bx.fillStyle = MUTED;
  bx.font = `500 38px ${SANS}`;
  bx.fillText(card.backText[0], 64, 840);
  bx.fillText(card.backText[1], 64, 888);
  bx.font = `400 28px ${MONO}`;
  bx.fillStyle = PAPER;
  spaced(bx, card.linkedinLine, 64, H - 130, 2);
  spaced(bx, card.githubLine, 64, H - 84, 2);
  bx.restore();

  return { front: toTexture(f.c), back: toTexture(b.c) };
}

/** Strap tile: yellow webbing with the name set along its length. Tiles seamlessly in x. */
export function makeStrapTexture() {
  const W = 1600;
  const H = 400;
  const { c, ctx } = canvas(W, H);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, W, H);
  // woven edge lines
  ctx.fillStyle = 'rgba(27,21,0,0.9)';
  ctx.fillRect(0, 26, W, 6);
  ctx.fillRect(0, H - 32, W, 6);
  ctx.fillStyle = 'rgba(27,21,0,0.2)';
  for (let x = 0; x < W; x += 16) ctx.fillRect(x, 44, 6, H - 88);
  ctx.fillStyle = '#1b1500';
  ctx.font = `800 150px ${SANS}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(card.strap, W / 2 - 40, H / 2 + 6);
  // separator diamond
  ctx.save();
  ctx.translate(W - 40, H / 2);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-14, -14, 28, 28);
  ctx.restore();
  const t = toTexture(c, 8);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}


