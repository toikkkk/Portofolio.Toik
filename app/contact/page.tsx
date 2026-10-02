import CopyButton from '@/components/CopyButton';
import { TransitionLink } from '@/components/TransitionLink';
import { ArrowIcon } from '@/components/Icons';
import { profile } from '@/data/content';

export const metadata = { title: 'Contact | Moch Toriq Hisam' };

export default function ContactPage() {
  return (
    <div className="contact-center">
      <p className="eyebrow">Contact</p>
      <h1 className="page-title">Open to <span className="mark">an internship.</span></h1>
      <p className="lead" style={{ marginTop: 18 }}>
        The fastest way to reach me is email. My CV has the same details in one page.
      </p>

      <div className="contact-list">
        <div className="contact-row">
          <span className="eyebrow">Email</span>
          <span className="val">{profile.email}</span>
          <CopyButton text={profile.email} />
        </div>
        <div className="contact-row">
          <span className="eyebrow">Phone</span>
          <a className="val" href={profile.phoneHref}>{profile.phone}</a>
          <CopyButton text={profile.phone} />
        </div>
        <div className="contact-row">
          <span className="eyebrow">LinkedIn</span>
          <a className="val" href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/{profile.linkedinHandle}</a>
          <span />
        </div>
        <div className="contact-row">
          <span className="eyebrow">GitHub</span>
          <a className="val" href={profile.github} target="_blank" rel="noreferrer">github.com/{profile.githubHandle}</a>
          <span />
        </div>
        <div className="contact-row">
          <span className="eyebrow">Based in</span>
          <span className="val">{profile.location}</span>
          <span />
        </div>
      </div>

      <div className="btn-row">
        <TransitionLink href="/cv" label="CV" className="btn btn-primary">
          View CV <ArrowIcon />
        </TransitionLink>
      </div>
    </div>
  );
}
