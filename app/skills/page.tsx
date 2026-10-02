import SkillsIndex from '@/components/SkillsIndex';

export const metadata = { title: 'Skills | Moch Toriq Hisam' };

export default function SkillsPage() {
  return (
    <>
      <p className="eyebrow">Skills / what I use</p>
      <h1 className="page-title">Tools I work with, <span className="mark">by job.</span></h1>
      <p className="lead" style={{ marginTop: 18 }}>
        Grouped by the part of a project they belong to: modeling, data movement, and the app around it.
      </p>
      <SkillsIndex />
    </>
  );
}
