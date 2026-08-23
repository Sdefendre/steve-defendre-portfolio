import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../Sidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Sidebar', () => {
  const mockUsePathname = vi.mocked(usePathname);

  it('uses a compact tablet header while preserving every critical route', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    const header = screen.getByRole('complementary');
    const identity = screen.getByText('Steve Defendre').parentElement;
    const status = screen.getByTitle('Available for select builds and advisory work');
    const cta = screen.getByRole('link', { name: /start a project/i });

    expect(header).toHaveClass(
      'pl-[max(0.75rem,env(safe-area-inset-left,0px))]',
      'pr-[max(0.75rem,env(safe-area-inset-right,0px))]',
      'md:block',
      'lg:px-6',
    );
    expect(identity).toHaveClass('hidden', 'lg:block');
    expect(status).toHaveClass('hidden', 'lg:flex');
    expect(cta).toHaveClass('w-11', 'px-0', 'md:w-auto', 'md:px-4');
    expect(cta).toHaveAttribute('href', '/contact');

    for (const name of ['Home', 'About', 'Projects', 'Contact']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    }
  });

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

    const githubLink = screen.getByRole('link', { name: 'GitHub (opens in a new tab)' });
    const linkedInLink = screen.getByRole('link', { name: 'LinkedIn (opens in a new tab)' });
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
    expect(headshot).toHaveAttribute('loading', 'lazy');
    expect(headshot).not.toHaveAttribute('fetchpriority', 'high');
  });

  it('renders a clear contact CTA', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    const cta = screen.getByRole('link', { name: /start a project/i });
    expect(cta).toHaveAttribute('href', '/contact');
    expect(cta.className).toContain('bg-[var(--accent-strong)]');
  });
});
