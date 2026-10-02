'use client';

import { useEffect, useRef } from 'react';

// Target cursor (see cursor-spec.md): a small square of four rotating brackets that follows the mouse and,
// over an interactive element, stretches to wrap that element. It is switched off inside the hero, where
// the liquid-glass lens cursor takes over.
const DEFAULT_SELECTOR = 'a, button, select, summary, [role="button"], .cursor-target, [data-cursor-target="true"]';
const TEXT_FIELDS = 'input, textarea, [contenteditable="true"]';
const LENS_AREA = '.hero';
const BASE = 34; // idle size
const PAD = 20; // extra room around a target
const MAGNET = 0.08;

export function TargetCursor({ selector = DEFAULT_SELECTOR }: { selector?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(pointer: fine)');
    const small = window.matchMedia('(max-width: 720px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const enabled = () => fine.matches && !small.matches && !reduce.matches;
    if (!enabled()) return;

    let raf = 0;
    let last = 0;
    let visible = false;
    let pressed = false;
    let hidden = false; // over a text field or inside the lens area
    let target: HTMLElement | null = null;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2; // pointer
    let x = px;
    let y = py;
    let w = BASE;
    let h = BASE; // cursor position and size

    const findTarget = (t: EventTarget | null) => {
      const node = t instanceof Element ? t : null;
      hidden = !!node?.closest(`${TEXT_FIELDS}, ${LENS_AREA}`);
      const hit = node?.closest(selector) ?? null;
      target =
        !hidden &&
        hit instanceof HTMLElement &&
        !(hit.hasAttribute('disabled') || hit.getAttribute('aria-disabled') === 'true' || hit.closest('[aria-hidden="true"]'))
          ? hit
          : null;
    };

    // frame-rate independent easing: k is the per-frame factor at 60fps
    const ease = (k: number, dt: number) => 1 - Math.pow(1 - k, dt * 60);

    const tick = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30);
      last = now;

      const rect = target?.getBoundingClientRect();
      if (target && rect && rect.width > 0 && rect.height > 0) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const k = ease(0.34, dt);
        x += (cx + (px - cx) * MAGNET - x) * k;
        y += (cy + (py - cy) * MAGNET - y) * k;
        w += (rect.width + PAD - w) * k;
        h += (rect.height + PAD - h) * k;
        el.classList.add('is-targeting');
      } else {
        const k = ease(0.24, dt);
        x += (px - x) * k;
        y += (py - y) * k;
        w += (BASE - w) * k;
        h += (BASE - h) * k;
        el.classList.remove('is-targeting');
      }

      el.classList.toggle('is-visible', visible && !hidden);
      el.classList.toggle('is-pressed', pressed);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`;

      // stop while the pointer is outside the window; the next pointermove wakes the loop
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      visible = true;
      px = e.clientX;
      py = e.clientY;
      findTarget(e.target);
      wake();
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') findTarget(e.target);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = () => {
      visible = false;
      target = null;
    };
    const onResize = () => {
      if (enabled()) {
        document.body.classList.add('tc-active');
        el.classList.add('is-ready');
        return;
      }
      visible = false;
      target = null;
      document.body.classList.remove('tc-active');
      el.classList.remove('is-ready', 'is-visible', 'is-pressed', 'is-targeting');
    };
    // while scrolling, a target moves even though the pointer is still
    const onScroll = () => wake();

    document.body.classList.add('tc-active');
    el.classList.add('is-ready');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.body.classList.remove('tc-active');
    };
  }, [selector]);

  return (
    <div className="tc" ref={ref} aria-hidden="true">
      <div className="tc-rotor">
        <span className="tc-corner tc-corner--tl" />
        <span className="tc-corner tc-corner--tr" />
        <span className="tc-corner tc-corner--br" />
        <span className="tc-corner tc-corner--bl" />
      </div>
      <span className="tc-dot" />
    </div>
  );
}
