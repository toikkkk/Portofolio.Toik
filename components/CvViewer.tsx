'use client';
import { useEffect, useRef, useState } from 'react';

type Props = { src: string; fallbackHref: string; label: string; loading: string; error: string; openLabel: string };

/**
 * Draws every page of the PDF onto canvases with pdf.js. The browser's own PDF viewer is not used, so
 * the CV shows on the page even when the browser is set to download PDFs instead of opening them.
 */
export default function CvViewer({ src, fallbackHref, label, loading, error, openLabel }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    let timer = 0;
    let doc: import('pdfjs-dist').PDFDocumentProxy | null = null;
    let renderId = 0;

    const draw = async () => {
      if (!doc || !el) return;
      const id = ++renderId;
      const width = el.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvases: HTMLCanvasElement[] = [];
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        if (cancelled || id !== renderId) return;
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * dpr });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        canvas.setAttribute('aria-hidden', 'true');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no 2d context');
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled || id !== renderId) return;
        canvases.push(canvas);
      }
      // swap in all pages at once so a resize never shows a half-drawn document
      el.replaceChildren(...canvases);
    };

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        // public/pdf.worker.min.js is copied from node_modules by the postinstall script, so it always matches the installed pdf.js
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        // The CV is small, so load it in one request instead of byte-range requests.
        doc = await pdfjs.getDocument({ url: src, disableRange: true, disableStream: true }).promise;
        if (cancelled) return;
        await draw();
        if (!cancelled) setStatus('ready');
      } catch (e) {
        const err = e as { name?: string; message?: string; status?: number };
        console.error('CV viewer failed:', err.name, err.message, err.status);
        if (!cancelled) setStatus('error');
      }
    })();

    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        draw().catch(() => undefined);
      }, 250);
    });
    ro.observe(el);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      ro.disconnect();
      doc?.destroy();
    };
  }, [src]);

  return (
    <div className="cv-viewer" role="document" aria-label={label} aria-busy={status === 'loading'}>
      <div ref={box} className="cv-pages" />
      {status === 'loading' && <p className="cv-fallback">{loading}</p>}
      {status === 'error' && (
        <p className="cv-fallback">
          {error}{' '}
          <a href={fallbackHref} target="_blank" rel="noopener noreferrer">
            {openLabel}
          </a>
          .
        </p>
      )}
    </div>
  );
}
