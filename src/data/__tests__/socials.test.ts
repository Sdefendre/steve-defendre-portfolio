import { contactLinks, primaryContactEmail, socialLinks, supportLink } from '../socials';

describe('Socials Data', () => {
  describe('socialLinks', () => {
    it('should not be empty', () => {
      expect(socialLinks.length).toBeGreaterThan(0);
    });

    it('each social link should have valid fields', () => {
      socialLinks.forEach((link) => {
        expect(typeof link.name).toBe('string');
        expect(link.name.length).toBeGreaterThan(0);

        expect(typeof link.href).toBe('string');
        expect(link.href).toMatch(/^https?:\/\//);

        expect(link.icon).toBeDefined();
      });
    });

    it('should have unique names', () => {
      const names = socialLinks.map(l => l.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('should have unique hrefs', () => {
      const hrefs = socialLinks.map(l => l.href);
      const uniqueHrefs = new Set(hrefs);
      expect(uniqueHrefs.size).toBe(hrefs.length);
    });

    it('should promote professional links without Support as a primary social CTA', () => {
      const names = socialLinks.map(l => l.name);
      expect(names).toEqual(['GitHub', 'LinkedIn', 'Defendre Solutions']);
      expect(names).not.toContain('Support');
    });
  });

  describe('contactLinks', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(contactLinks)).toBe(true);
      expect(contactLinks.length).toBeGreaterThan(0);
    });

    it('each contact link should have valid fields', () => {
      contactLinks.forEach((link) => {
        expect(typeof link.name).toBe('string');
        expect(link.name.length).toBeGreaterThan(0);

        expect(typeof link.value).toBe('string');
        expect(link.value.length).toBeGreaterThan(0);

        expect(typeof link.href).toBe('string');
        expect(link.href.startsWith('https://') || link.href.startsWith('mailto:')).toBe(true);

        expect(link.icon).toBeDefined();

        expect(typeof link.description).toBe('string');
        expect(link.description.length).toBeGreaterThan(0);

        expect(['primary', 'secondary', 'footer']).toContain(link.priority);
      });
    });

    it('should have unique names', () => {
      const names = contactLinks.map(l => l.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    it('keeps the public studio email as the single primary contact address', () => {
      const primaryContact = contactLinks.find((link) => link.priority === 'primary');

      expect(primaryContactEmail).toBe('steve@defendresolutions.com');
      expect(primaryContact?.value).toBe(primaryContactEmail);
      expect(primaryContact?.href).toBe(`mailto:${primaryContactEmail}`);
    });

    it('should keep Support as a footer-priority contact link', () => {
      expect(supportLink.href).toBe('https://buymeacoffee.com/defendresolutions');
      expect(supportLink.priority).toBe('footer');
      expect(contactLinks.at(-1)).toBe(supportLink);
    });
  });
});
