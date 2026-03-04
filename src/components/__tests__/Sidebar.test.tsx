import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../Sidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, className, ...props }: any) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    (usePathname as any).mockReturnValue('/');
    render(<Sidebar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights the active link based on pathname', () => {
    (usePathname as any).mockReturnValue('/about');
    render(<Sidebar />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
    expect(aboutLink).toHaveClass('bg-gray-100');

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).not.toHaveAttribute('aria-current');
    expect(homeLink).not.toHaveClass('bg-gray-100');
  });

  it('renders social links correctly', () => {
    (usePathname as any).mockReturnValue('/');
    render(<Sidebar />);

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();

    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Sdefendre');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders the profile information', () => {
    (usePathname as any).mockReturnValue('/');
    render(<Sidebar />);

    expect(screen.getByText('Steve Defendre')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    const headshot = screen.getByAltText('Steve Defendre');
    expect(headshot).toBeInTheDocument();
    expect(headshot).toHaveAttribute('src', '/headshot.jpg');
  });
});
