'use client';
import { useEffect, useState } from 'react';

export default function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setSwap(true);
      setTimeout(() => {
        setI((n) => (n + 1) % words.length);
        setSwap(false);
      }, 260);
    }, 2800);
    return () => clearInterval(id);
  }, [words.length]);

  return <span className={`word${swap ? ' swap' : ''}`}>{words[i]}</span>;
}
