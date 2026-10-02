import { TransitionLink } from './TransitionLink';
import NavLinks from './NavLinks';
import { ChevronDownIcon, GithubIcon, InstagramIcon, LanguageIcon, LinkedinIcon } from './Icons';
import { profile } from '@/data/content';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="frame">
      <header className="topbar">
        <TransitionLink href="/" label="Home" className="brand" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" />
          <span>Toik<i>.</i></span>
        </TransitionLink>
        <NavLinks />
        <div className="tools">
          <label className="lang">
            <LanguageIcon />
            <span className="sr-only">Language</span>
            <select defaultValue="en" aria-label="Language">
              <option value="en">English</option>
              <option value="id" disabled>Indonesia (soon)</option>
            </select>
            <ChevronDownIcon />
          </label>
          <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <GithubIcon />
          </a>
          <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
            <LinkedinIcon />
          </a>
          {profile.instagram && (
            <a className="icon-btn" href={profile.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
          )}
        </div>
      </header>
      <main className="main" tabIndex={-1}>{children}</main>
      <footer className="footbar">
        <span>Applied data science</span>
        <span>ML / NLP / full-stack</span>
        <span>@{profile.githubHandle}</span>
      </footer>
    </div>
  );
}

