import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  const defaultProps = {
    initials: 'JD',
    title: 'John Doe Project',
    description: 'A test project description.',
    role: 'Full-stack implementer',
    outcome: 'A measurable product outcome for the client.',
    tags: ['React', 'TypeScript'],
    ctaLabel: 'Open project',
  };

  it('renders basic project information correctly', () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.role)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.outcome)).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Outcome')).toBeInTheDocument();
    defaultProps.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders as a div when url is not provided', () => {
    const { container } = render(<ProjectCard {...defaultProps} />);
    // The outermost element should be a div since url is undefined
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('renders as an anchor tag when url is provided', () => {
    const props = {
      ...defaultProps,
      url: 'https://example.com',
    };
    const { container } = render(<ProjectCard {...props} />);

    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor.nodeName).toBe('A');
    expect(anchor).toHaveAttribute('href', props.url);
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    expect(anchor).toHaveAccessibleName(`${props.ctaLabel} for ${props.title} (opens in new tab)`);
    expect(screen.getByText(props.ctaLabel)).toBeInTheDocument();
  });

  it('renders as an anchor tag when mixed-case protocol url is provided', () => {
    const props = {
      ...defaultProps,
      url: 'HTTPS://example.com',
    };
    const { container } = render(<ProjectCard {...props} />);

    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor.nodeName).toBe('A');
    expect(anchor).toHaveAttribute('href', props.url);
  });

  it('renders a custom image when image prop is provided', () => {
    const props = { ...defaultProps, image: '/test-image.png' };
    render(<ProjectCard {...props} />);

    const img = screen.getByRole('img');
    const imgSrc = img.getAttribute('src');
    expect(imgSrc).not.toBeNull();
    expect(decodeURIComponent(imgSrc ?? '')).toContain(props.image);
    expect(img).toHaveAttribute('alt', `${props.title} live project preview for ${props.role}`);
    expect(img).toHaveAttribute(
      'sizes',
      '(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 520px'
    );
  });

  it('renders compact variant with shorter text treatment and compact image sizes', () => {
    const props = {
      ...defaultProps,
      image: '/test-image.png',
      url: 'https://example.com',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    };
    render(<ProjectCard {...props} variant="compact" />);

    expect(screen.getByText(props.description)).toHaveClass('line-clamp-3');
    expect(screen.getByText(props.outcome)).toHaveClass('line-clamp-3');
    expect(screen.getByRole('img')).toHaveAttribute(
      'sizes',
      '(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 42vw, 420px'
    );
  });

  it('renders detailed variant without clamping the description', () => {
    render(<ProjectCard {...defaultProps} variant="detailed" />);

    expect(screen.getByText(defaultProps.description)).not.toHaveClass('line-clamp-2');
  });

  it('renders a linked fallback preview without an iframe when url is provided and image is missing', () => {
    const props = { ...defaultProps, url: 'https://example.com' };
    const { container } = render(<ProjectCard {...props} />);

    expect(container.firstChild?.nodeName).toBe('A');
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', props.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText(defaultProps.initials)).toBeInTheDocument();
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('renders fallback gradient with initials when image and url are missing', () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.initials)).toBeInTheDocument();
    // Gradient class is applied to the wrapper div, not the initials span
    const gradientContainer = screen
      .getByText(defaultProps.initials)
      .closest('div[aria-hidden="true"]');
    expect(gradientContainer).not.toBeNull();
    expect(gradientContainer).toHaveClass('bg-gradient-to-br');
  });

  it('renders fallback gradient with initials when a linked project has no image', () => {
    const props = { ...defaultProps, url: 'https://example.com' };
    render(<ProjectCard {...props} />);

    expect(screen.getByText(defaultProps.initials)).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('prefers custom image over fallback when url is provided', () => {
    const props = {
      ...defaultProps,
      url: 'https://example.com',
      image: '/test-image.png',
    };
    render(<ProjectCard {...props} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', props.url);
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('handles empty tags array without rendering any tags', () => {
    const props = { ...defaultProps, tags: [] };
    render(<ProjectCard {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();

    const tagsContainer = screen.getByTestId('project-tags');
    expect(tagsContainer).toBeInTheDocument();
    expect(within(tagsContainer).queryByRole('generic')).not.toBeInTheDocument();
    expect(tagsContainer.children.length).toBe(0);
  });
});
