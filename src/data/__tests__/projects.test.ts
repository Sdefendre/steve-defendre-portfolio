import { describe, it, expect } from 'vitest';
import { projects } from '../projects';

describe('Projects Data', () => {
  it('should be an array', () => {
    expect(Array.isArray(projects)).toBe(true);
  });

  it('should not be empty', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each project should have valid required fields', () => {
    projects.forEach((project) => {
      expect(project.initials).toBeDefined();
      expect(typeof project.initials).toBe('string');
      expect(project.initials.length).toBeGreaterThan(0);

      expect(project.title).toBeDefined();
      expect(typeof project.title).toBe('string');
      expect(project.title.length).toBeGreaterThan(0);

      expect(project.description).toBeDefined();
      expect(typeof project.description).toBe('string');
      expect(project.description.length).toBeGreaterThan(0);

      expect(Array.isArray(project.tags)).toBe(true);
      expect(project.tags.length).toBeGreaterThan(0);
      project.tags.forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });

      expect(project.gradient).toBeDefined();
      expect(typeof project.gradient).toBe('string');
      expect(project.gradient).toMatch(/from-.+ to-.+/);

      expect(project.url).toBeDefined();
      expect(typeof project.url).toBe('string');
      expect(project.url).toMatch(/^https?:\/\//);
    });
  });

  it('optional fields should have valid types if present', () => {
    projects.forEach((project) => {
      if (project.image !== undefined) {
        expect(typeof project.image).toBe('string');
        expect(project.image.length).toBeGreaterThan(0);
        // Image can be a relative path or an absolute URL
        expect(project.image.startsWith('/') || project.image.startsWith('http')).toBe(true);
      }

      if (project.priority !== undefined) {
        expect(typeof project.priority).toBe('boolean');
      }
    });
  });

  it('should have unique titles', () => {
    const titles = projects.map(p => p.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('should have unique URLs', () => {
    const urls = projects.map(p => p.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });
});
