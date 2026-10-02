import { ICONS } from './skillIcons';
import { REPOS, capabilities, delivery, skillsCore, type Proof, type Tool } from '@/data/skills-content';

// Layout for /skills (see skills-page-spec.md): a focus card and a "how I deliver" card on the left, an index
// of seven capability rows with slow chip marquees on the right. Server component: the marquee is pure CSS.

const PROOF_TITLE: Partial<Record<Proof, string>> = {
  course: 'Dari praktikum/kuliah',
  work: 'Pengalaman kerja',
};

// Tools named in `delivery` that are not in `capabilities`, or are spelled differently there.
const EXTRA_ICONS: Record<string, string> = { Plotly: 'plotly', README: 'markdown', 'Claude Code': 'claude' };
const norm = (s: string) => s.toLowerCase().replace(/^adobe /, '');
const toolByName = new Map(capabilities.flatMap((c) => c.tools).map((t) => [norm(t.name), t]));

function SkillChip({ tool }: { tool: Tool }) {
  const Icon = tool.icon ? ICONS[tool.icon] : undefined;
  const repoTitle = tool.proof === 'repo' && tool.repos?.length ? `Repo: ${tool.repos.map((r) => REPOS[r]?.title ?? r).join(', ')}` : undefined;
  const title = PROOF_TITLE[tool.proof] ?? repoTitle;
  return (
    <span className={`chip skill-chip${tool.proof === 'course' ? ' skill-chip--course' : ''}`} title={title}>
      {Icon ? <Icon className="skill-ico" aria-hidden="true" /> : <span className="skill-mono" aria-hidden="true">{tool.name.charAt(0)}</span>}
      {tool.name}
    </span>
  );
}

function DeliveryChip({ name }: { name: string }) {
  const known = toolByName.get(norm(name));
  const tool: Tool = known ? { ...known, name } : { name, icon: EXTRA_ICONS[name], proof: 'repo' };
  return <SkillChip tool={tool} />;
}

function CapabilityRow({ cap, index }: { cap: (typeof capabilities)[number]; index: number }) {
  const n = cap.tools.length;
  const isStatic = cap.id === 'media' || n < 4;
  // enough chips per set to cover the container; the loop needs two identical sets
  const reps = Math.max(1, Math.ceil(12 / n));
  const set = Array.from({ length: reps }, () => cap.tools).flat();
  const duration = Math.max(40, set.length * 5);

  return (
    <li className="cap-row">
      <div className="cap-row-head">
        <h3>{cap.title}</h3>
        <span className="cap-count" aria-label={`${n} tools`}>{n}</span>
      </div>
      <p className="cap-blurb">{cap.blurb}</p>

      {/* names for assistive tech; the visual chips below are decorative copies */}
      <ul className="sr-only">
        {cap.tools.map((t) => (
          <li key={t.name}>{t.name}</li>
        ))}
      </ul>

      {isStatic ? (
        <div className="mq-static is-always" aria-hidden="true">
          {cap.tools.map((t) => (
            <SkillChip key={t.name} tool={t} />
          ))}
        </div>
      ) : (
        <>
          <div className="mq" aria-hidden="true">
            <div className="mq-track" style={{ ['--mq-dur' as string]: `${duration}s`, ['--mq-dir' as string]: index % 2 ? 'reverse' : 'normal' }}>
              <div className="mq-set">
                {set.map((t, i) => (
                  <SkillChip key={`${t.name}-${i}`} tool={t} />
                ))}
              </div>
              <div className="mq-set" aria-hidden="true">
                {set.map((t, i) => (
                  <SkillChip key={`${t.name}-${i}`} tool={t} />
                ))}
              </div>
            </div>
          </div>
          {/* narrow screens and reduced motion: a plain wrapped list instead of the marquee */}
          <div className="mq-static" aria-hidden="true">
            {cap.tools.map((t) => (
              <SkillChip key={t.name} tool={t} />
            ))}
          </div>
        </>
      )}
    </li>
  );
}

export default function SkillsIndex() {
  return (
    <div className="skills-layout">
      <div className="skills-left">
        <section className="card skills-core" aria-labelledby="skills-core-title">
          <span className="sk-watermark" aria-hidden="true">SKILLS</span>
          <span className="chip chip-accent">{skillsCore.badge}</span>
          <h2 id="skills-core-title">{skillsCore.title}</h2>
          <p className="sk-text">{skillsCore.text}</p>
          <dl className="sk-evidence">
            {skillsCore.evidence.map((e) => (
              <div key={e.label}>
                <dt>{e.label}</dt>
                <dd>{e.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="card skills-deliver" aria-labelledby="skills-deliver-title">
          <div className="sk-panel-head">
            <h2 id="skills-deliver-title" className="eyebrow">How I deliver</h2>
            <span className="eyebrow">{delivery.length} groups</span>
          </div>
          <div className="sk-deliver-grid">
            {delivery.map((g) => (
              <div key={g.title}>
                <h3 className="sk-group-title">{g.title}</h3>
                <div className="chips">
                  {g.tools.map((name) => (
                    <DeliveryChip key={name} name={name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card skills-panel" aria-labelledby="skills-index-title">
        <div className="sk-panel-head">
          <h2 id="skills-index-title" className="eyebrow">Capability index</h2>
          <span className="eyebrow">{capabilities.length} areas</span>
        </div>
        <ul className="cap-list">
          {capabilities.map((c, i) => (
            <CapabilityRow key={c.id} cap={c} index={i} />
          ))}
        </ul>
      </section>
    </div>
  );
}
