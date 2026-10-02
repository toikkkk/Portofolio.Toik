'use client';

import Link from 'next/link';
import { useRouteTransition } from './RouteTransition';

/** Internal link that plays the page curtain. Modified clicks, middle clicks and external URLs behave normally. */
export function TransitionLink({ href, label, children, onClick, ...rest }: React.ComponentProps<typeof Link> & { label: string }) {
  const { go } = useRouteTransition();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (typeof href !== 'string' || !href.startsWith('/')) return;
        e.preventDefault();
        go(href, label);
      }}
    >
      {children}
    </Link>
  );
}
