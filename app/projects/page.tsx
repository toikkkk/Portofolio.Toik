import { existsSync } from 'node:fs';
import path from 'node:path';
import ProjectArchive from '@/components/ProjectArchive';
import { projects } from '@/data/content';

export const metadata = { title: 'Projects | Moch Toriq Hisam' };

// A screenshot saved as public/projects/<slug>.png (or .jpg / .jpeg / .webp) fills that project's preview frame.
function findPreviews() {
  const out: Record<string, string> = {};
  for (const p of projects) {
    const ext = ['png', 'jpg', 'jpeg', 'webp'].find((e) => existsSync(path.join(process.cwd(), 'public', 'projects', `${p.slug}.${e}`)));
    if (ext) out[p.slug] = `/projects/${p.slug}.${ext}`;
  }
  return out;
}

export default function ProjectsPage() {
  return (
    <>
      <p className="eyebrow">2025 – 2026 / selected work</p>
      <h1 className="page-title">Selected <span className="mark">projects.</span></h1>
      <ProjectArchive previews={findPreviews()} />
    </>
  );
}
