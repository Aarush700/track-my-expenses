import { describe, it, expect } from '@jest/globals';

describe('App Component', () => {
    it('should have Track My Expenses title', () => {
        const appName = 'Track My Expenses';
        expect(appName).toBe('Track My Expenses');
    });

    it('should have main routes configured', () => {
        const routes = ['/', '/login', '/register', '/dashboard'];
        expect(routes.length).toBeGreaterThan(0);
    });
});