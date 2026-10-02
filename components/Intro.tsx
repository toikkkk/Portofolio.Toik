'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Greetings shown one after another before the landing page. The last one is held longer.
const GREETINGS = [
  { text: 'Hello', lang: 'en' },
  { text: '你好', lang: 'zh' },
  { text: '안녕하세요', lang: 'ko' },
  { text: 'こんにちは', lang: 'ja' },
  { text: 'Bonjour', lang: 'fr' },
  { text: 'Hola', lang: 'es' },
  { text: 'Halo', lang: 'id' },
];
const STEP_MS = 480;
const LAST_MS = 900;
const EXIT_MS = 1000;

type Phase = 'show' | 'exit' | 'gone';

/**
 * Full-screen greeting intro. The inline script in layout.tsx sets <html data-intro="pending"> on the
 * first visit of a session to "/" (and "done" otherwise, or with reduced motion), so the overlay never
 * flashes on later visits. Flipping the attribute to "done" is what starts the landing page's entrance
 * animations (see globals.css).
 */
export default function Intro() {
  const [phase, setPhase] = useState<Phase>('show');
  const [i, setI] = useState(0);
  const reticle = useRef<HTMLDivElement>(null);
  const exiting = useRef(false);

  const finish = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    setPhase('exit');
    try {
      sessionStorage.setItem('intro-seen', '1');
    } catch {
      /* private mode: the intro simply plays again next visit */
    }
    // let the landing entrance start while the curtain is still lifting
    window.setTimeout(() => {
      document.documentElement.dataset.intro = 'done';
    }, 250);
    window.setTimeout(() => {
      document.body.style.overflow = '';
      setPhase('gone');
    }, EXIT_MS + 100);
  }, []);

  // cycle the greetings
  useEffect(() => {
    if (document.documentElement.dataset.intro !== 'pending') {
      setPhase('gone');
      return;
    }
    document.body.style.overflow = 'hidden';
    let n = 0;
    let t: number;
    const tick = () => {
      if (n >= GREETINGS.length - 1) {
        t = window.setTimeout(finish, LAST_MS);
        return;
      }
      n += 1;
      setI(n);
      t = window.setTimeout(tick, n === GREETINGS.length - 1 ? 0 : STEP_MS);
    };
    t = window.setTimeout(tick, STEP_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  // the corner-bracket reticle trails the pointer
  useEffect(() => {
    const el = reticle.current;
    if (!el || phase === 'gone') return;
    let tx = 0, ty = 0, x = 0, y = 0, seen = false, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        el.style.opacity = '1';
      }
    };
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x - 23}px, ${y - 23}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  if (phase === 'gone') return null;
  const g = GREETINGS[i];

  return (
    <div className={`intro${phase === 'exit' ? ' is-exit' : ''}`} role="status" aria-live="polite" aria-label="Welcome">
      <div className="intro-reticle" ref={reticle} aria-hidden="true" />
      <div className="intro-stage">
        <span className="intro-dot" aria-hidden="true" />
        <p className="intro-word" lang={g.lang} key={g.text}>
          {g.text}
        </p>
        <span className="intro-dot" aria-hidden="true" />
      </div>
      <span className="intro-rule" aria-hidden="true" />
      <button type="button" className="intro-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
