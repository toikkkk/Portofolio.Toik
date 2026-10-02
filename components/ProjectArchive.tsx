'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { projects, type Project } from '@/data/content';
import { ArrowIcon } from './Icons';

const GAP = 28; // keep in sync with .pslide margin-bottom
const pad = (n: number) => String(n).padStart(2, '0');

// Host of the first non-GitHub link, shown in the preview frame's address bar.
function addressOf(p: Project) {
  const site = p.links.find((l) => !/github\.com/.test(l.href));
  try {
    return site ? new URL(site.href).host : '';
  } catch {
    return '';
  }
}

export default function ProjectArchive({ previews }: { previews: Record<string, string> }) {
  const [active, setActive] = useState(0);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);
  const mirror = useRef(false);

  const stickTop = () => parseFloat(getComputedStyle(wrap.current!).getPropertyValue('--stick')) || 16;

  // Document offset of slide i in the normal flow. Sticky slides keep their flow slot, so this works
  // even while a slide is stuck (offsetTop would report the stuck position).
  const naturalTop = useCallback((i: number) => {
    let top = wrap.current!.getBoundingClientRect().top + window.scrollY;
    for (let k = 0; k < i; k++) top += (slides.current[k]?.offsetHeight ?? 0) + GAP;
    return top;
  }, []);

  const scrollTo = useCallback(
    (i: number, smooth = true) => {
      const top = naturalTop(i) - stickTop();
      window.scrollTo({ top, behavior: smooth && !reduce.current ? 'smooth' : 'auto' });
    },
    [naturalTop]
  );

  const pick = (i: number) => {
    scrollTo(i);
    history.replaceState(null, '', `#${projects[i].slug}`);
  };

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = wrap.current!;
    let raf = 0;

    // each slide's height drives how far it may stick (so tall slides can scroll to their bottom first)
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) (e.target as HTMLElement).style.setProperty('--h', `${(e.target as HTMLElement).offsetHeight}px`);
    });
    slides.current.forEach((s) => s && ro.observe(s));

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;

      // current slide = the last one whose top has risen past 35% of the viewport
      let cur = 0;
      slides.current.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top <= vh * 0.35) cur = i;
      });
      setActive((prev) => (prev === cur ? prev : cur));

      // the slide being covered shrinks a little as the next one slides over it
      slides.current.forEach((s, i) => {
        const inner = s?.firstElementChild as HTMLElement | null;
        const next = slides.current[i + 1];
        if (!s || !inner) return;
        let progress = 0;
        if (next && !reduce.current) {
          const covered = s.getBoundingClientRect().top + s.offsetHeight - next.getBoundingClientRect().top;
          progress = Math.min(1, Math.max(0, covered / s.offsetHeight));
        }
        inner.style.transform = progress ? `scale(${1 - 0.04 * progress})` : '';
        inner.style.opacity = progress ? String(1 - 0.25 * progress) : '';
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    // deep link: /projects#galeria
    const fromHash = () => {
      const i = projects.findIndex((p) => p.slug === window.location.hash.slice(1));
      if (i >= 0) requestAnimationFrame(() => scrollTo(i, false));
    };
    // read the initial hash now, before anything can rewrite it, and only start mirroring the current
    // slide into the URL once that jump has happened
    const first = projects.findIndex((p) => p.slug === window.location.hash.slice(1));
    if (first >= 0) {
      requestAnimationFrame(() => {
        scrollTo(first, false);
        mirror.current = true;
      });
    } else {
      mirror.current = true;
    }
    window.addEventListener('hashchange', fromHash);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', fromHash);
      cancelAnimationFrame(raf);
      ro.disconnect();
      root.querySelectorAll<HTMLElement>('.pslide-inner').forEach((el) => {
        el.style.transform = '';
        el.style.opacity = '';
      });
    };
  }, [scrollTo]);

  // keep the active entry visible inside the (scrollable) project list, without moving the page
  useEffect(() => {
    const box = list.current;
    const it = items.current[active];
    if (!box || !it) return;
    if (box.scrollWidth > box.clientWidth) {
      // narrow screens: the list is a horizontal strip
      const left = it.offsetLeft - (box.clientWidth - it.offsetWidth) / 2;
      box.scrollTo({ left, behavior: reduce.current ? 'auto' : 'smooth' });
    } else if (it.offsetTop < box.scrollTop) box.scrollTop = it.offsetTop - 8;
    else if (it.offsetTop + it.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = it.offsetTop + it.offsetHeight - box.clientHeight + 8;
  }, [active]);

  // mirror the current slide in the address bar without adding history entries
  useEffect(() => {
    if (mirror.current && window.scrollY > 40) history.replaceState(null, '', `#${projects[active].slug}`);
  }, [active]);

  return (
    <div className="archive">
      <nav className="plist" aria-label="Project list">
        <div className="plist-head">
          <span className="eyebrow">Project list</span>
          <span className="eyebrow">{projects.length} projects</span>
        </div>
        <div className="plist-body" ref={list}>
          {projects.map((item, i) => (
            <button
              key={item.slug}
              ref={(el) => {
                items.current[i] = el;
              }}
              className="pitem"
              aria-current={i === active}
              onClick={() => pick(i)}
            >
              <span className="eyebrow">{[pad(i + 1), item.kind].filter(Boolean).join(' / ')}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </nav>

      <div className="pslides" ref={wrap}>
        {projects.map((p, i) => {
          const preview = previews[p.slug];
          const address = addressOf(p);
          return (
            <section
              key={p.slug}
              id={p.slug}
              className="pslide"
              style={{ zIndex: i + 1 }}
              ref={(el) => {
                slides.current[i] = el;
              }}
              aria-labelledby={`${p.slug}-title`}
            >
              <div className="pslide-inner">
                <div className="pslide-text">
                  <div className="pslide-top">
                    <div className="chips">
                      {p.tags.map((t, k) => (
                        <span key={t} className={`chip${k === 0 ? ' chip-accent' : ''}`}>{t}</span>
                      ))}
                    </div>
                    <span className="eyebrow">{pad(i + 1)} / {pad(projects.length)}</span>
                  </div>

                  <p className="eyebrow">{[p.year, p.kind].filter(Boolean).join(' / ')}</p>
                  <h2 id={`${p.slug}-title`}>{p.title}</h2>
                  {p.subtitle && <p className="subtitle">{p.subtitle}</p>}
                  <p className="summary">{p.summary}</p>

                  {p.flow.length > 0 && (
                    <>
                      <p className="eyebrow block-title">How it flows</p>
                      <ol className="flow">
                        {p.flow.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                    </>
                  )}

                  {p.highlights.length > 0 && (
                    <>
                      <p className="eyebrow block-title">What I did</p>
                      <ul className="points">
                        {p.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {p.metrics && (
                    <>
                      <p className="eyebrow block-title">Results</p>
                      <div className="metrics">
                        {p.metrics.map((m) => (
                          <div className="metric" key={m.label}>
                            <b>{m.value}</b>
                            <span>{m.label}</span>
                          </div>
                        ))}
                      </div>
                      {p.note && <p className="note">{p.note}</p>}
                    </>
                  )}

                  {p.stack.length > 0 && (
                    <>
                      <p className="eyebrow block-title">Stack</p>
                      <div className="chips">
                        {p.stack.map((s) => (
                          <span className="chip" key={s}>{s}</span>
                        ))}
                      </div>
                    </>
                  )}

                  {p.links.length > 0 ? (
                    <div className="btn-row">
                      {p.links.map((l) => (
                        <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label} <ArrowIcon />
                        </a>
                      ))}
                    </div>
                  ) : (
                    !p.pending && (
                      <p className="note" style={{ marginTop: 28 }}>
                        {p.tags.includes('Private') ? 'Client work: no public repository.' : 'Repository not public yet.'}
                      </p>
                    )
                  )}
                </div>

                <figure className="pslide-preview">
                  <div className="browser">
                    <div className="browser-bar" aria-hidden="true">
                      <i /><i /><i />
                      <span className="browser-url">{address || p.slug}</span>
                    </div>
                    <div className="browser-body">
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt={`${p.title} interface`} loading={i < 2 ? 'eager' : 'lazy'} />
                      ) : (
                        <span className="browser-empty">Preview coming soon</span>
                      )}
                    </div>
                  </div>
                </figure>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
