'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { about, card } from '@/data/content';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

function Fallback() {
  return (
    <div className="lanyard-fallback" aria-hidden>
      <div className="fallback-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" />
        <div>
          <strong>{card.nameLines[0]}<br />{card.nameLines[1]}</strong>
          <br />
          <small>{card.role}</small>
        </div>
      </div>
    </div>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Lanyard() {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => {
    setGl(hasWebGL());
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="lanyard-panel" ref={box}>
      {gl === false || gl === null ? <Fallback /> : <div className="lanyard-canvas"><Scene active={visible} /></div>}
      <span className="lanyard-hint">{about.hintLabel}</span>
    </div>
  );
}
