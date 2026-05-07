import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GitHubIcon, LinkedInIcon, SupportIcon } from '../SocialIcons';

describe('SocialIcons', () => {
  describe('GitHubIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<GitHubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('applies custom className', () => {
      const { container } = render(<GitHubIcon className="test-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('test-class');
    });
  });

  describe('LinkedInIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<LinkedInIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('applies custom className', () => {
      const { container } = render(<LinkedInIcon className="test-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('test-class');
    });
  });

  describe('SupportIcon', () => {
    it('renders correctly', () => {
      const { container } = render(<SupportIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('applies custom className', () => {
      const { container } = render(<SupportIcon className="test-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('test-class');
    });
  });
});
