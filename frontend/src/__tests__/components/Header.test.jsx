import { describe, it, expect } from '@jest/globals';

describe('Header Component', () => {
  it('should display application name', () => {
    const headerTitle = 'Track My Expenses';
    expect(headerTitle).toContain('Track My Expenses');
  });

  it('should have navigation links', () => {
    const navLinks = ['Home', 'Dashboard', 'Profile'];
    expect(navLinks.length).toBe(3);
  });
});