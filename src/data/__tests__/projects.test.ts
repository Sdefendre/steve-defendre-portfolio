import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  filterProjectCatalog,
  listPublicProjects,
  projectCategories,
  projects,
  projectsFilterHref,
  type ProjectStatus,
} from '../projects';

const projectStatuses = ['Live', 'Prototype'] satisfies ProjectStatus[];
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../..',
);
const publicDirectory = path.join(repositoryRoot, 'public');

describe('Projects Data', () => {
  it('preserves the complete current-main project catalog', () => {
    expect(projects.map((project) => project.title)).toEqual([
      'Defendre Solutions',
      'FreeVoiceTranscribe',
      'BraidsbyRose',
      'Traces',
      'WealthWise',
      'Krystin Sylvia',
      'Velocity Care LLC',
      'Command.AI',
    ]);
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

      expect(project.role).toBeDefined();
      expect(typeof project.role).toBe('string');
      expect(project.role.length).toBeGreaterThan(0);

      expect(project.outcome).toBeDefined();
      expect(typeof project.outcome).toBe('string');
      expect(project.outcome.length).toBeGreaterThan(0);

      expect(projectCategories).toContain(project.category);
      expect(Number.isInteger(project.year)).toBe(true);
      expect(project.year).toBeGreaterThan(2000);
      expect(project.year).toBeLessThanOrEqual(new Date().getFullYear());
      expect(projectStatuses).toContain(project.status);

      expect(project.caseStudy).toBeDefined();
      ['challenge', 'approach', 'impact'].forEach((field) => {
        const value = project.caseStudy[field as keyof typeof project.caseStudy];
        expect(typeof value).toBe('string');
        expect(value.trim().length).toBeGreaterThan(0);
      });

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
      expect(project.url).toMatch(/^https:\/\//);
      const url = new URL(project.url);
      expect(url.protocol).toBe('https:');
      expect(url.username).toBe('');
      expect(url.password).toBe('');
      expect(url.hostname.length).toBeGreaterThan(0);
    });
  });

  it('optional fields should have valid types if present', () => {
    projects.forEach((project) => {
      if (project.image !== undefined) {
        expect(typeof project.image).toBe('string');
        expect(project.image.length).toBeGreaterThan(0);
        expect(project.image).toMatch(/^\/(?!\/)/);

        const resolvedImage = path.resolve(publicDirectory, `.${project.image}`);
        expect(resolvedImage.startsWith(`${publicDirectory}${path.sep}`)).toBe(true);
        expect(existsSync(resolvedImage)).toBe(true);
      }

      if (project.priority !== undefined) {
        expect(typeof project.priority).toBe('boolean');
      }

      if (project.ctaLabel !== undefined) {
        expect(typeof project.ctaLabel).toBe('string');
        expect(project.ctaLabel.length).toBeGreaterThan(0);
      }
    });
  });

  it('should include studio proof for the featured project', () => {
    const [featuredProject] = projects;

    expect(featuredProject.title).toBe('Defendre Solutions');
    expect(featuredProject.role).toMatch(/Founder/i);
    expect(featuredProject.outcome).toMatch(/studio site/i);
    expect(featuredProject.ctaLabel).toBe('Visit studio');
    expect(featuredProject.priority).toBeUndefined();
  });

  it('points Traces at the live GitHub Pages marketing site', () => {
    const traces = projects.find((project) => project.title === 'Traces');

    expect(traces).toBeDefined();
    expect(traces?.url).toBe('https://sdefendre.github.io/traces-app/');
    expect(traces?.ctaLabel).toBe('View product site');
  });

  it('points WealthWise at the live GitHub Pages marketing site', () => {
    const wealthwise = projects.find((project) => project.title === 'WealthWise');
    const catalogText = [
      wealthwise?.description,
      wealthwise?.outcome,
      wealthwise?.caseStudy.challenge,
      wealthwise?.caseStudy.approach,
      wealthwise?.caseStudy.impact,
    ].join(' ');

    expect(wealthwise).toBeDefined();
    expect(wealthwise?.category).toBe('Product');
    expect(wealthwise?.status).toBe('Prototype');
    expect(wealthwise?.url).toBe('https://sdefendre.github.io/Wealthwise/');
    expect(wealthwise?.ctaLabel).toBe('View product site');
    expect(wealthwise?.image).toBe('/project-previews/wealthwise.jpg');
    expect(wealthwise?.url).not.toMatch(/github\.com\/Sdefendre\/Wealthwise/i);
    expect(catalogText).toMatch(/No Plaid/);
    expect(catalogText).toMatch(/bundled sample/i);
    expect(catalogText).toMatch(/not a live balance/i);
    expect(catalogText).not.toMatch(/Plaid connects|open source/i);
  });

  it('leaves every other project URL and CTA unchanged', () => {
    expect(
      Object.fromEntries(
        projects
          .filter((project) => project.title !== 'Traces' && project.title !== 'WealthWise')
          .map((project) => [project.title, { url: project.url, ctaLabel: project.ctaLabel }]),
      ),
    ).toEqual({
      'Defendre Solutions': {
        url: 'https://defendresolutions.com',
        ctaLabel: 'Visit studio',
      },
      FreeVoiceTranscribe: {
        url: 'https://github.com/Sdefendre/freevoicetranscribe',
        ctaLabel: 'View on GitHub',
      },
      BraidsbyRose: {
        url: 'https://braidsbyrose.com',
        ctaLabel: 'View booking site',
      },
      'Krystin Sylvia': {
        url: 'https://krystinsylvia.com',
        ctaLabel: 'View portfolio',
      },
      'Velocity Care LLC': {
        url: 'https://velocitycarellc.com',
        ctaLabel: 'Visit healthcare site',
      },
      'Command.AI': {
        url: 'https://trycommand.vercel.app',
        ctaLabel: 'Open platform',
      },
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

  it('exports a stable category list for filtering', () => {
    expect(projectCategories).toEqual(['Studio', 'Client', 'Product']);
  });
});

describe('project catalog helpers', () => {
  it('lists the public fields agents can read', () => {
    const catalog = listPublicProjects();

    expect(catalog).toHaveLength(projects.length);
    expect(catalog[4]).toEqual({
      title: 'WealthWise',
      category: 'Product',
      status: 'Prototype',
      url: 'https://sdefendre.github.io/Wealthwise/',
      description: projects[4].description,
    });
    expect(filterProjectCatalog(projects, 'Product').map((project) => project.title)).toEqual([
      'FreeVoiceTranscribe',
      'Traces',
      'WealthWise',
      'Command.AI',
    ]);
    expect(projectsFilterHref('Product')).toBe('/projects?category=Product');
  });
});
