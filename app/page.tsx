import { TransitionLink } from '@/components/TransitionLink';
import Hero from '@/components/Hero';
import Lanyard from '@/components/lanyard/Lanyard';
import { ArrowIcon, GithubIcon, LinkedinIcon } from '@/components/Icons';
import { about, capabilities, profile } from '@/data/content';

export default function Home() {
  return (
    <>
      <Hero />

      <section className="about-split" aria-labelledby="about-title">
        <div className="about-copy">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="about-title">{about.headingLead}<span className="mark">{about.headingMark}</span></h2>
          <p className="lead">{about.summary}</p>
          <ul className="facts">
            {about.facts.map((f) => (
              <li key={f.label}>
                <span className="eyebrow">{f.label}</span>
                <span>{f.value}</span>
              </li>
            ))}
          </ul>
          <div className="about-links">
            <TransitionLink href="/about" label="About" className="btn btn-primary">
              {about.moreLabel} <ArrowIcon />
            </TransitionLink>
            <TransitionLink href="/cv" label="CV" className="btn">
              {about.viewCvLabel}
            </TransitionLink>
            <a href={profile.cv} download className="btn">
              {about.downloadCvLabel}
            </a>
            <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={about.githubLabel}>
              <GithubIcon />
            </a>
            <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={about.linkedinLabel}>
              <LinkedinIcon />
            </a>
          </div>
        </div>
        <div className="lanyard-slot">
          <Lanyard />
        </div>
      </section>
      <section aria-labelledby="cap-title">
        <div className="cap-head">
          <h2 id="cap-title" className="eyebrow">What I work on</h2>
          <span className="eyebrow">Looking for an internship</span>
        </div>
        <div className="cap-grid">
          {capabilities.map((c) => (
            <article className="cap" key={c.tag}>
              <span className="eyebrow">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}


