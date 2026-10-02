'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Five-panel curtain between routes: it closes top-down (left to right), the route changes while it is
// shut, then it opens bottom-up (right to left). See page-transition.md for the measured timings.
type Phase = 'idle' | 'departing' | 'arriving';

const PANELS = 5;
const COVER_MS = 440 + 34 * (PANELS - 1); // 576
const REVEAL_MS = 560 + 30 * (PANELS - 1); // 680
const SAFETY_MS = 4000; // open the curtain anyway if the route never changes (network error)

type Ctx = { go: (href: string, label: string) => void; busy: boolean };
const RouteTransitionCtx = createContext<Ctx>({ go: () => {}, busy: false });
export const useRouteTransition = () => useContext(RouteTransitionCtx);

const pathOf = (href: string) => href.split('#')[0].split('?')[0] || '/';

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('');
  const phaseRef = useRef<Phase>('idle'); // read synchronously so a fast double click cannot start two curtains
  const target = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const change = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const finish = () => {
    change('idle');
    target.current = null;
  };

  const go = useCallback(
    (href: string, nextLabel: string) => {
      if (phaseRef.current !== 'idle') return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // same page (e.g. only the #hash differs) or reduced motion: navigate straight away, no curtain
      if (reduce || pathOf(href) === pathname) {
        router.push(href);
        return;
      }
      target.current = href;
      setLabel(nextLabel);
      change('departing');
      later(() => router.push(href), COVER_MS); // swap the route while the curtain is shut
      later(() => {
        change('arriving');
        later(finish, REVEAL_MS);
      }, COVER_MS + SAFETY_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, router]
  );

  // The new route is in place: reset scroll and focus, then open the curtain.
  useEffect(() => {
    const dest = target.current;
    if (phaseRef.current === 'departing' && dest && pathname === pathOf(dest)) {
      clear();
      if (!dest.includes('#')) window.scrollTo(0, 0); // a #hash target positions itself
      document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
      change('arriving');
      later(finish, REVEAL_MS);
    }
    // helpers only touch refs and setState, so re-running on `pathname` alone is correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clear, []);

  return (
    <RouteTransitionCtx.Provider value={{ go, busy: phase !== 'idle' }}>
      {children}
      {phase !== 'idle' && (
        <div className={`rt rt--${phase}`} aria-hidden="true">
          <div className="rt-panels">
            {Array.from({ length: PANELS }, (_, i) => (
              <span
                key={i}
                className="rt-panel"
                style={{
                  ['--cover-delay' as string]: `${i * 34}ms`,
                  ['--reveal-delay' as string]: `${(PANELS - 1 - i) * 30}ms`,
                }}
              />
            ))}
          </div>
          <span className="rt-label">{label}</span>
        </div>
      )}
    </RouteTransitionCtx.Provider>
  );
}
