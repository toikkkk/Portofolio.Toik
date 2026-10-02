import { TransitionLink } from '@/components/TransitionLink';
import CvViewer from '@/components/CvViewer';
import { ArrowIcon } from '@/components/Icons';
import { cvPage, profile } from '@/data/content';

export const metadata = { title: 'CV | Moch Toriq Hisam' };

export default function CvPage() {
  return (
    <>
      <p className="eyebrow">{cvPage.eyebrow}</p>
      <h1 className="page-title">{cvPage.title}<span className="mark">{cvPage.titleMark}</span></h1>
      <p className="lead" style={{ marginTop: 18 }}>{cvPage.lead}</p>
      <div className="btn-row">
        <a href={profile.cv} download className="btn btn-primary">
          {cvPage.downloadLabel}
        </a>
        <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="btn">
          {cvPage.newTabLabel}
        </a>
        <TransitionLink href="/" label="Home" className="btn">
          <ArrowIcon dir="left" /> {cvPage.backLabel}
        </TransitionLink>
      </div>

      <CvViewer
        src="/api/cv"
        fallbackHref={profile.cv}
        label={cvPage.frameTitle}
        loading={cvPage.loading}
        error={cvPage.fallback}
        openLabel={cvPage.newTabLabel}
      />
    </>
  );
}
