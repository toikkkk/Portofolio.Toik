// Liquid-glass lens cursor, adapted from Hyperiux Vault: https://vault.hyperiux.com
// This project styles with plain CSS, so the original Tailwind classes are inline styles here.
// `children` may be a render function: it is called with { lens: true } for the magnified copy
// inside the lens, which lets the caller swap in different content (here, the colour portrait).
'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

export interface LiquidGlassCursorProps {
  children: ReactNode | ((ctx: { lens: boolean }) => ReactNode);
  size?: number;
  magnification?: number;
  textHoverSize?: number;
  maxButtonWidth?: number;
  maxButtonHeight?: number;
  distortion?: number;
  aberration?: number;
  /** Wrapper background. May be transparent (e.g. a page background shows through). */
  bgColor?: string;
  /** Opaque surface drawn behind the magnified copy; defaults to bgColor, so pass one if bgColor is transparent. */
  lensBgColor?: string;
  className?: string;
  label?: string;
}

const TEXT_SELECTOR = '[data-cursor="text"], p, span, h1, h2, h3, h4, h5, h6, label';
const BUTTON_SELECTOR = '[data-cursor="button"], button, a, [role="button"], input, select, textarea';

const fill: CSSProperties = { position: 'absolute', inset: 0 };
const corner: CSSProperties = { position: 'absolute', left: 0, top: 0, pointerEvents: 'none', borderRadius: 9999 };

export default function LiquidGlassCursor({
  children,
  size = 110,
  magnification = 1.2,
  textHoverSize = 84,
  maxButtonWidth = 170,
  maxButtonHeight = 70,
  distortion = 60,
  aberration = 1,
  bgColor = '#ffffff',
  lensBgColor,
  className = '',
  label,
}: LiquidGlassCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const filterId = `lgc-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [copyStyle, setCopyStyle] = useState<CSSProperties>({});
  const [mapUrl, setMapUrl] = useState('');
  const reduceMotion = useReducedMotion();

  // The displacement bitmap is drawn once at the largest size any shape can reach, then stretched
  // to the live lens size (preserveAspectRatio="none"); redrawing pixels every frame would jank.
  const mapSize = Math.max(size, textHoverSize, maxButtonWidth, maxButtonHeight);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const presence = useMotionValue(0);
  const targetW = useMotionValue(size);
  const targetH = useMotionValue(size);

  const springConfig = { stiffness: 300, damping: 26 };
  const shapeSpringConfig = { stiffness: 340, damping: 28 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);
  const scale = useSpring(presence, { stiffness: 260, damping: 20 });
  const sw = useSpring(targetW, shapeSpringConfig);
  const sh = useSpring(targetH, shapeSpringConfig);

  const setShapeForTarget = (target: EventTarget | null) => {
    const el = target instanceof Element ? target : null;
    if (el?.closest(BUTTON_SELECTOR)) {
      targetW.set(maxButtonWidth);
      targetH.set(maxButtonHeight);
    } else if (el?.closest(TEXT_SELECTOR)) {
      targetW.set(textHoverSize);
      targetH.set(textHoverSize);
    } else {
      targetW.set(size);
      targetH.set(size);
    }
  };

  // Radial displacement map: neutral (128,128) at the centre, pulling samples toward it with a
  // cubic falloff so the bulge lives at the rim.
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = mapSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(mapSize, mapSize);
    const c = mapSize / 2;
    for (let py = 0; py < mapSize; py++) {
      for (let px = 0; px < mapSize; px++) {
        const dx = px - c;
        const dy = py - c;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nd = Math.min(dist / c, 1);
        const strength = nd * nd * nd;
        const ux = dist > 0 ? dx / dist : 0;
        const uy = dist > 0 ? dy / dist : 0;
        const i = (py * mapSize + px) * 4;
        img.data[i] = Math.round(255 * (0.5 - 0.5 * ux * strength));
        img.data[i + 1] = Math.round(255 * (0.5 - 0.5 * uy * strength));
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const url = canvas.toDataURL();
    const raf = requestAnimationFrame(() => setMapUrl(url));
    return () => cancelAnimationFrame(raf);
  }, [mapSize]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ width: el.offsetWidth, height: el.offsetHeight });
      // mirror the wrapper's surface so the lens magnifies bg + layout, not just children
      const cs = getComputedStyle(el);
      setCopyStyle({
        backgroundColor: lensBgColor ?? cs.backgroundColor,
        backgroundImage: cs.backgroundImage,
        backgroundSize: cs.backgroundSize,
        backgroundPosition: cs.backgroundPosition,
        padding: cs.padding,
        boxSizing: 'border-box',
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [lensBgColor]);

  // The lens holds a duplicate of the content: keep its links out of the tab order and the a11y tree.
  useEffect(() => {
    lensRef.current?.setAttribute('inert', '');
  }, []);

  const lensX = useTransform([sx, sw], ([v, w]) => (v as number) - (w as number) / 2);
  const lensY = useTransform([sy, sh], ([v, h]) => (v as number) - (h as number) / 2);
  // light comes from the top-left, so the glass casts its shadow down-right
  const shadowX = useTransform([sx, sw], ([v, w]) => (v as number) - (w as number) / 2 + 8);
  const shadowY = useTransform([sy, sh], ([v, h]) => (v as number) - (h as number) / 2 + 12);
  // place the magnified copy so the point under the cursor stays centred in the lens
  const copyX = useTransform([sx, sw], ([v, w]) => (w as number) / 2 - magnification * (v as number));
  const copyY = useTransform([sy, sh], ([v, h]) => (h as number) / 2 - magnification * (v as number));

  // chromatic aberration: each channel refracts at a different strength
  const scaleR = distortion * (1 + 0.5 * aberration);
  const scaleG = distortion;
  const scaleB = distortion * (1 - 0.5 * aberration);
  const isolate = (channel: 0 | 1 | 2) =>
    [0, 1, 2, 3]
      .map((row) => {
        const r = [0, 0, 0, 0, 0];
        if (row === 3) r[3] = 1;
        else if (row === channel) r[channel] = 1;
        return r.join(' ');
      })
      .join('  ');

  const render = (lens: boolean) => (typeof children === 'function' ? children({ lens }) : children);
  const regionProps = label ? { role: 'region' as const, 'aria-label': label } : {};

  // Reduced motion: no lens, normal cursor, plain content.
  if (reduceMotion) {
    return (
      <div className={className} style={{ backgroundColor: bgColor }} {...regionProps}>
        {render(false)}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...regionProps}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        presence.set(1);
      }}
      onMouseOver={(e) => setShapeForTarget(e.target)}
      onMouseLeave={() => {
        presence.set(0);
        targetW.set(size);
        targetH.set(size);
      }}
      style={{ backgroundColor: bgColor, position: 'relative', overflow: 'hidden', cursor: 'none' }}
      className={className}
    >
      {render(false)}

      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {mapUrl && (
            <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feImage href={mapUrl} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
              <feColorMatrix in="SourceGraphic" type="matrix" values={isolate(0)} result="cr" />
              <feDisplacementMap in="cr" in2="map" scale={scaleR} xChannelSelector="R" yChannelSelector="G" result="dr" />
              <feColorMatrix in="SourceGraphic" type="matrix" values={isolate(1)} result="cg" />
              <feDisplacementMap in="cg" in2="map" scale={scaleG} xChannelSelector="R" yChannelSelector="G" result="dg" />
              <feColorMatrix in="SourceGraphic" type="matrix" values={isolate(2)} result="cb" />
              <feDisplacementMap in="cb" in2="map" scale={scaleB} xChannelSelector="R" yChannelSelector="G" result="db" />
              <feComposite in="dr" in2="dg" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="drg" />
              <feComposite in="drg" in2="db" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          )}
        </defs>
      </svg>

      <motion.div
        aria-hidden="true"
        style={{ ...corner, x: shadowX, y: shadowY, scale, width: sw, height: sh, zIndex: 10, background: 'rgba(0,0,0,0.45)', filter: 'blur(24px)' }}
      />

      <motion.div
        ref={lensRef}
        aria-hidden="true"
        style={{ ...corner, x: lensX, y: lensY, scale, width: sw, height: sh, zIndex: 20, overflow: 'hidden' }}
      >
        <div style={{ ...fill, filter: mapUrl ? `url(#${filterId})` : undefined }}>
          <motion.div
            style={{
              ...copyStyle,
              position: 'absolute',
              left: 0,
              top: 0,
              x: copyX,
              y: copyY,
              scale: magnification,
              width: dims.width,
              height: dims.height,
              transformOrigin: '0 0',
            }}
          >
            {render(true)}
          </motion.div>
        </div>
        <div
          style={{
            ...fill,
            borderRadius: 9999,
            background: 'radial-gradient(ellipse 45% 30% at 32% 24%, rgba(255,255,255,0.35), transparent 70%)',
          }}
        />
        <div
          style={{
            ...fill,
            borderRadius: 9999,
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.25), inset 2px 4px 10px rgba(255,255,255,0.18), inset -3px -5px 14px rgba(0,0,0,0.35)',
          }}
        />
      </motion.div>
    </div>
  );
}
