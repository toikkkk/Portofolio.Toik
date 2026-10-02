import { education, experience, honors } from '@/data/content';

export const metadata = { title: 'About | Moch Toriq Hisam' };

export default function AboutPage() {
  return (
    <>
      <p className="eyebrow">About / background</p>
      <h1 className="page-title">Student who ships <span className="mark">things that run.</span></h1>
      <p className="lead" style={{ marginTop: 18 }}>
        I am in my third year of a D4 in Applied Data Science. Most of what I know I learned by building: a text model needs labels, an API, a dashboard and a deployment before anyone can use it.
      </p>

      <div className="cols">
        <section className="card" aria-label="Experience">
          <span className="eyebrow">Experience</span>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.when}>
                <span className="when">{e.when}</span>
                <h3>{e.role}</h3>
                <span className="org">{e.org} · {e.kind}</span>
                <p>{e.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="card" aria-label="Education">
          <span className="eyebrow">Education</span>
          <ol className="timeline">
            {education.map((e) => (
              <li key={e.school}>
                <span className="when">{e.when}</span>
                <h3>{e.school}</h3>
                {e.degree && <span className="org">{e.degree}</span>}
                <p>{e.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="card span-2" aria-label="Competitions">
          <span className="eyebrow">Competitions</span>
          <div className="honors">
            {honors.map((h) => (
              <div className="honor" key={h.title}>
                <b>{h.title}</b>
                <span>{h.org}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
