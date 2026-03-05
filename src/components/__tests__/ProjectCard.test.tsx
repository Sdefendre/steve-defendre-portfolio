import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  const defaultProps = {
    initials: 'JD',
    title: 'John Doe Project',
    description: 'A test project description.',
    tags: ['React', 'TypeScript'],
  };

  it('renders basic project information correctly', () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
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
    const props = { ...defaultProps, url: 'https://example.com' };
    const { container } = render(<ProjectCard {...props} />);

    const anchor = container.firstChild as HTMLAnchorElement;
    expect(anchor.nodeName).toBe('A');
    expect(anchor).toHaveAttribute('href', props.url);
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a custom image when image prop is provided', () => {
    const props = { ...defaultProps, image: '/test-image.png' };
    render(<ProjectCard {...props} />);

    const img = screen.getByRole('img');
    const imgSrc = img.getAttribute('src');
    expect(imgSrc).not.toBeNull();
    expect(decodeURIComponent(imgSrc ?? '')).toContain(props.image);
    expect(img).toHaveAttribute('alt', props.title);
  });

  it('renders an iframe when url is provided and useIframe is true (default)', () => {
    const props = { ...defaultProps, url: 'https://example.com' };
    render(<ProjectCard {...props} />);

    const iframe = screen.getByTitle(props.title);
    expect(iframe.nodeName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('src', props.url);
  });

  it('renders fallback gradient with initials when image and url are missing', () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.initials)).toBeInTheDocument();
    // Gradient class is applied to the wrapper div, not the initials span
    const gradientContainer = screen.getByText(defaultProps.initials).closest('div');
    expect(gradientContainer).not.toBeNull();
    expect(gradientContainer).toHaveClass('bg-gradient-to-br');
  });

  it('renders fallback gradient with initials when useIframe is false and no image', () => {
    const props = { ...defaultProps, url: 'https://example.com', useIframe: false };
    render(<ProjectCard {...props} />);

    expect(screen.getByText(defaultProps.initials)).toBeInTheDocument();
    // Iframe should NOT be present
    expect(screen.queryByTitle(props.title)).not.toBeInTheDocument();
  });

  it('prefers custom image over iframe even if url is provided', () => {
    const props = {
      ...defaultProps,
      url: 'https://example.com',
      image: '/test-image.png',
      useIframe: true
    };
    render(<ProjectCard {...props} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByTitle(props.title)).not.toBeInTheDocument();
  });
});
