import { describe, it, expect } from 'vitest';
import { Promotion } from './promotion.entity';

describe('Promotion Entity (Frontend)', () => {
  describe('applyDiscount', () => {
    it('should calculate discounted price correctly', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      expect(promotion.applyDiscount(100)).toBe(80);
    });

    it('should handle 50% discount', () => {
      const promotion = new Promotion(1, 'HALF', 50);
      expect(promotion.applyDiscount(100)).toBe(50);
      expect(promotion.applyDiscount(200)).toBe(100);
    });

    it('should handle different percentages', () => {
      const promo20 = new Promotion(1, 'SAVE20', 20);
      const promo75 = new Promotion(2, 'SAVE75', 75);

      expect(promo20.applyDiscount(100)).toBe(80);
      expect(promo75.applyDiscount(100)).toBe(25);
    });

    it('should handle decimal prices', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      expect(promotion.applyDiscount(99.99)).toBeCloseTo(79.992, 2);
    });
  });
});
