import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavLink } from '../NavLink';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className, 'aria-current': ariaCurrent }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    'aria-current'?: React.AriaAttributes['aria-current'];
  }) => (
    <a href={href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}));

describe('NavLink', () => {
  const mockUsePathname = vi.mocked(usePathname);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a Next.js Link for internal paths', () => {
    mockUsePathname.mockReturnValue('/');
    render(<NavLink href="/about">About</NavLink>);

    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveAttribute('href', '/about');
    expect(link).not.toHaveAttribute('target');
  });

  it('renders a standard anchor for external paths', () => {
    mockUsePathname.mockReturnValue('/');
    render(<NavLink href="https://example.com">External</NavLink>);

    const link = screen.getByRole('link', { name: /external/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('sets aria-current="page" when active', () => {
    mockUsePathname.mockReturnValue('/about');
    render(<NavLink href="/about">About</NavLink>);

    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('applies active class when isActive is true (function className)', () => {
    mockUsePathname.mockReturnValue('/about');
    render(
      <NavLink
        href="/about"
        className={({ isActive }) => isActive ? 'active-class' : 'inactive-class'}
      >
        About
      </NavLink>
    );

    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveClass('active-class');
  });

  it('renders children based on isActive state (function children)', () => {
    mockUsePathname.mockReturnValue('/about');
    render(
      <NavLink href="/about">
        {({ isActive }) => (isActive ? 'Active Label' : 'Inactive Label')}
      </NavLink>
    );

    expect(screen.getByText('Active Label')).toBeInTheDocument();
  });

  it('handles target="_blank" and sets rel automatically', () => {
    mockUsePathname.mockReturnValue('/');
    render(
      <NavLink href="/some-pdf" target="_blank">
        Download
      </NavLink>
    );

    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
