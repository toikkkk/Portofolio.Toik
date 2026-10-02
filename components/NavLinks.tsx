'use client';
import { TransitionLink } from './TransitionLink';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Expertise' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function NavLinks() {
  const path = usePathname();
  return (
    <nav aria-label="Sections" className="nav">
      {items.map((i) => {
        const active = i.href === '/' ? path === '/' : path.startsWith(i.href);
        return (
          <TransitionLink key={i.href} href={i.href} label={i.label} className="nav-link" aria-current={active ? 'page' : undefined}>
            {i.label}
          </TransitionLink>
        );
      })}
    </nav>
  );
}
