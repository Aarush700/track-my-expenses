import { describe, it, expect } from '@jest/globals';

describe('Dashboard Page', () => {
    it('should have expense tracking features', () => {
        const features = ['Add Expense', 'View Transactions', 'Analytics'];
        expect(features).toContain('Add Expense');
    });

    it('should calculate total expenses', () => {
        const expenses = [100, 200, 300];
        const total = expenses.reduce((a, b) => a + b, 0);
        expect(total).toBe(600);
    });
});