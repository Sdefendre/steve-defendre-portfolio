import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentPropsWithoutRef, ImgHTMLAttributes, ReactNode } from 'react';
import Sidebar from '../Sidebar';
import { usePathname } from 'next/navigation';

type MockLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'className'>;

interface MockImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
}

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: MockLinkProps) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ priority, ...props }: MockImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} data-priority={priority ? 'true' : undefined} />;
  },
}));

describe('Sidebar', () => {
  const mockUsePathname = vi.mocked(usePathname);

  it('renders all navigation items', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    mockUsePathname.mockReturnValue('/about');
    render(<Sidebar />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
    expect(aboutLink.className).toContain('dock-link-active');

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).not.toHaveAttribute('aria-current');
    expect(homeLink.className).toContain('border-transparent');
  });

  it('renders available social links correctly', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    const githubLink = screen.getByRole('link', { name: /github/i });
    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Sdefendre');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink.className).toContain('focus-ring');
    expect(linkedInLink).toHaveAttribute('target', '_blank');
  });

  it('renders the profile information', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    expect(screen.getByText('Steve Defendre')).toBeInTheDocument();
    expect(screen.getByText('Full-stack developer')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    const headshot = screen.getByAltText('Steve Defendre');
    expect(headshot).toBeInTheDocument();
    const headshotSrc = headshot.getAttribute('src');
    expect(headshotSrc).not.toBeNull();
    expect(decodeURIComponent(headshotSrc ?? '')).toContain('/headshot.jpg');
    expect(headshot).toHaveAttribute('data-priority', 'true');
  });

  it('renders a clear contact CTA', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    const cta = screen.getByRole('link', { name: /start a project/i });
    expect(cta).toHaveAttribute('href', '/contact');
    expect(cta.className).toContain('bg-[var(--accent-strong)]');
  });
});
