import { describe, it, expect } from 'vitest';
import { isSafeHref } from '../url';

describe('isSafeHref', () => {
  it('allows safe protocols', () => {
    expect(isSafeHref('http://example.com')).toBe(true);
    expect(isSafeHref('https://example.com')).toBe(true);
    expect(isSafeHref('mailto:test@example.com')).toBe(true);
    expect(isSafeHref('tel:+1234567890')).toBe(true);
    expect(isSafeHref('HTTPS://EXAMPLE.COM')).toBe(true);
  });

  it('allows relative paths and anchors', () => {
    expect(isSafeHref('/about')).toBe(true);
    expect(isSafeHref('#contact')).toBe(true);
  });

  it('blocks unsafe protocols', () => {
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeHref('vbscript:msgbox("Hi")')).toBe(false);
    expect(isSafeHref('file:///etc/passwd')).toBe(false);
    expect(isSafeHref('//evil.example')).toBe(false);
  });

  it('handles empty or null inputs', () => {
    expect(isSafeHref('')).toBe(false);
    expect(isSafeHref(undefined)).toBe(false);
    expect(isSafeHref(null)).toBe(false);
    expect(isSafeHref('   ')).toBe(false);
  });
});
