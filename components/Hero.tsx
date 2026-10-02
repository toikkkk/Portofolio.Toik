'use client';
import Image from 'next/image';
import { TransitionLink } from '@/components/TransitionLink';
import LiquidGlassCursor from '@/components/ui/liquid-glass-cursor';
import RotatingWord from '@/components/RotatingWord';
import { ArrowIcon } from '@/components/Icons';
import { profile, rotatingWords } from '@/data/content';

// `lens` is true for the magnified copy shown inside the glass cursor. The colour portrait has
// exactly the same canvas size and subject bounds as the black-and-white one, so swapping it in
// lines up pixel for pixel and the colour appears only where the lens covers the person.
function HeroContent({ lens }: { lens: boolean }) {
  return (
    <>
      <p className="hero-intro">
        Hi, my name is <b>{profile.name}</b> and I am an aspiring
      </p>

      <h1 className="hero-title">
        <span className="solid">Data Scientist</span>
        <span className="outline">Data Analyst</span>
      </h1>

      <div className="hero-photo-wrap">
        <Image
          className="hero-photo"
          src={lens ? '/toik-portrait-color.png' : '/toik-portrait-bw.png'}
          alt={lens ? '' : 'Portrait of Moch Toriq Hisam'}
          width={1400}
          height={1400}
          priority={!lens}
          sizes="(max-width: 760px) 95vw, 640px"
        />
      </div>

      <p className="hero-sub">
        I build <RotatingWord words={rotatingWords} />
        <br />
        based in {profile.city}, Indonesia.
      </p>
      <ul className="hero-marks" aria-label="Stack">
        <li>PyTorch</li>
        <li>FastAPI</li>
        <li>Docker</li>
      </ul>

      <div className="hero-ctas">
        <TransitionLink href="/projects" label="Projects" className="btn btn-primary">
          Need a data scientist? <ArrowIcon />
        </TransitionLink>
        <TransitionLink href="/cv" label="CV" className="btn">
          Need a data analyst? View CV
        </TransitionLink>
      </div>
    </>
  );
}

export default function Hero() {
  return (
    // Gentle refraction so the portrait colours stay true inside the lens.
    <LiquidGlassCursor className="hero" label="Introduction" bgColor="#ffffff" distortion={10} aberration={0.15}>
      {({ lens }) => <HeroContent lens={lens} />}
    </LiquidGlassCursor>
  );
}


