import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource/anton/400.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import Shell from '@/components/Shell';
import Intro from '@/components/Intro';
import { RouteTransitionProvider } from '@/components/RouteTransition';
import { TargetCursor } from '@/components/TargetCursor';

export const metadata: Metadata = {
  title: 'Moch Toriq Hisam | Portfolio',
  description:
    'Applied Data Science student at PENS Surabaya. Machine learning, NLP and full-stack projects, from labeled data to API, dashboard and deployment.',
  openGraph: {
    title: 'Moch Toriq Hisam | Portfolio',
    description: 'Machine learning, NLP and full-stack projects by Moch Toriq Hisam.',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#ececea', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint: decides whether the greeting intro plays (first visit to "/" this session, motion allowed). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement;var s=sessionStorage.getItem('intro-seen');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.intro=(location.pathname==='/'&&!s&&!r)?'pending':'done';d.dataset.motion=r?'off':'on'}catch(e){document.documentElement.dataset.intro='done';document.documentElement.dataset.motion='off'}",
          }}
        />
      </head>
      <body>
        <RouteTransitionProvider>
          <Intro />
          <Shell>{children}</Shell>
        </RouteTransitionProvider>
        <TargetCursor />
      </body>
    </html>
  );
}
