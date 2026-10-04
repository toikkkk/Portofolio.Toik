'use client';

import type { RefObject } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, SplitText);

// Runs `cb` once the greeting intro has handed over (html[data-intro] leaves "pending"); at once if there was no intro.
function whenIntroDone(cb: () => void) {
  const root = document.documentElement;
  if (root.dataset.intro !== 'pending') {
    cb();
    return () => {};
  }
  const mo = new MutationObserver(() => {
    if (root.dataset.intro !== 'pending') {
      mo.disconnect();
      cb();
    }
  });
  mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] });
  return () => mo.disconnect();
}

/**
 * Opening animation for the hero. Elements opt in with data-hero="..." (the magnified copy inside the
 * glass cursor does not, so it stays untouched). Until this effect has built its timeline, CSS keeps
 * those elements hidden (html[data-motion="on"]); once GSAP owns their inline styles the container
 * gets data-ready and the CSS rule stops applying.
 */
export function useHeroMotion(scope: RefObject<HTMLElement>, enabled: boolean) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!enabled || !root) return;
      const q = (name: string) => root.querySelector<HTMLElement>(`[data-hero="${name}"]`);
      const intro = q('intro');
      const solid = q('solid');
      const outline = q('outline');
      const photo = q('photo');
      const rest = (['sub', 'marks', 'ctas'] as const).map(q).filter(Boolean) as HTMLElement[];
      if (!intro || !solid || !outline || !photo) return;

      let stopWaiting = () => {};
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const heading = [
          SplitText.create(solid, { type: 'chars', smartWrap: true }),
          SplitText.create(outline, { type: 'chars', smartWrap: true }),
        ];
        const everything = [intro, photo, ...rest];

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            // hand the exact original markup back, so the lens copy lines up pixel for pixel again
            heading.forEach((s) => s.revert());
            gsap.set(everything, { clearProps: 'all' });
          },
        });

        tl.from(intro, { autoAlpha: 0, y: 20, duration: 0.7 }, 0)
          // filled line rises into place, outline line drops in from above: the two meet in the middle
          .from(heading[0].chars, { autoAlpha: 0, y: 70, duration: 0.9, ease: 'power4.out', stagger: 0.035 }, 0.1)
          .from(heading[1].chars, { autoAlpha: 0, y: -70, duration: 0.9, ease: 'power4.out', stagger: { each: 0.03, from: 'end' } }, 0.3)
          .fromTo(
            photo,
            { autoAlpha: 0, y: 50, clipPath: 'inset(100% 0% 0% 0%)' },
            { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.out' },
            0.45
          )
          .from(rest, { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.9);

        // GSAP now owns the hidden starting state; stop the CSS fallback that hid these elements
        root.setAttribute('data-ready', '');

        // after a page change the route curtain is still opening: give it a moment before the hero starts
        const curtain = document.querySelector('.rt') ? 0.55 : 0;
        stopWaiting = whenIntroDone(() => {
          tl.delay(curtain).play();
        });

        return () => {
          stopWaiting();
          heading.forEach((s) => s.revert());
        };
      });

      // Parallax: depth layers move by different amounts. The motion is written as CSS variables on .hero
      // (not as transforms on the elements) so the magnified copy inside the glass cursor, which sits in
      // the same .hero, picks up exactly the same offsets and the colour reveal stays aligned.
      const hero = root.closest<HTMLElement>('.hero');
      if (hero) {
        mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
          const setScroll = gsap.quickTo(hero, '--hs', { duration: 0.5, ease: 'power3.out' });
          const onScroll = () => setScroll(Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight))));
          onScroll();
          window.addEventListener('scroll', onScroll, { passive: true });
          return () => {
            window.removeEventListener('scroll', onScroll);
            gsap.set(hero, { '--hs': 0 });
          };
        });
        mm.add('(min-width: 761px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
          const setX = gsap.quickTo(hero, '--hx', { duration: 0.9, ease: 'power3.out' });
          const setY = gsap.quickTo(hero, '--hy', { duration: 0.9, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            const r = hero.getBoundingClientRect();
            setX(Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))));
            setY(Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2))));
          };
          const onLeave = () => {
            setX(0);
            setY(0);
          };
          hero.addEventListener('pointermove', onMove, { passive: true });
          hero.addEventListener('pointerleave', onLeave);
          return () => {
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
            gsap.set(hero, { '--hx': 0, '--hy': 0 });
          };
        });
      }

      return () => {
        stopWaiting();
        mm.revert();
      };
    },
    { scope, dependencies: [enabled] }
  );
}
