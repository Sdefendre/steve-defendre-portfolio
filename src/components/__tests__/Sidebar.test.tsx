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
  });

  it('renders a clear contact CTA', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Sidebar />);

    const cta = screen.getByRole('link', { name: /start a project/i });
    expect(cta).toHaveAttribute('href', '/contact');
    expect(cta.className).toContain('bg-[var(--accent-strong)]');
  });
});
