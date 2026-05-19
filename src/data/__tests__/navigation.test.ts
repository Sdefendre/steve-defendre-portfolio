import { describe, it, expect } from 'vitest';
import { primaryNavItems, navItems } from '../navigation';

describe('Navigation Data', () => {
  it('should be an array', () => {
    expect(Array.isArray(primaryNavItems)).toBe(true);
    expect(Array.isArray(navItems)).toBe(true);
  });

  it('should not be empty', () => {
    expect(primaryNavItems.length).toBeGreaterThan(0);
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('navItems should be the same as primaryNavItems', () => {
    expect(navItems).toBe(primaryNavItems);
  });

  it('each navigation item should have valid required fields', () => {
    primaryNavItems.forEach((item) => {
      expect(item.name).toBeDefined();
      expect(typeof item.name).toBe('string');
      expect(item.name.length).toBeGreaterThan(0);

      expect(item.href).toBeDefined();
      expect(typeof item.href).toBe('string');
      expect(item.href.length).toBeGreaterThan(0);
      expect(item.href.startsWith('/')).toBe(true);

      expect(item.icon).toBeDefined();
      expect(item.activeIcon).toBeDefined();
    });
  });
});
