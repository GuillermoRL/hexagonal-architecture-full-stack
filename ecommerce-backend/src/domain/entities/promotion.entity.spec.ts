import { Promotion } from './promotion.entity';

describe('Promotion Entity', () => {
  describe('constructor and validation', () => {
    it('should create valid promotion', () => {
      const promotion = new Promotion(1, 'SUMMER50', 50);

      expect(promotion).toMatchObject({
        id: 1,
        code: 'SUMMER50',
        discount: 50,
      });
    });

    it('should throw error for negative discount', () => {
      expect(() => new Promotion(1, 'INVALID', -10)).toThrow(
        'Discount must be between 0 and 100',
      );
    });

    it('should throw error for discount > 100', () => {
      expect(() => new Promotion(1, 'INVALID', 150)).toThrow(
        'Discount must be between 0 and 100',
      );
    });

    it('should allow 0% and 100% discount', () => {
      expect(() => new Promotion(1, 'FREE', 100)).not.toThrow();
      expect(() => new Promotion(2, 'NONE', 0)).not.toThrow();
    });
  });

  describe('applyDiscount', () => {
    it('should calculate discounted price correctly', () => {
      const promotion50 = new Promotion(1, 'HALF', 50);
      expect(promotion50.applyDiscount(100)).toBe(50);
      expect(promotion50.applyDiscount(200)).toBe(100);
    });

    it('should handle different discount percentages', () => {
      const promotion20 = new Promotion(1, 'SAVE20', 20);
      const promotion75 = new Promotion(2, 'SAVE75', 75);

      expect(promotion20.applyDiscount(100)).toBe(80);
      expect(promotion75.applyDiscount(100)).toBe(25);
    });

    it('should handle 0% discount', () => {
      const noDiscount = new Promotion(1, 'NONE', 0);
      expect(noDiscount.applyDiscount(100)).toBe(100);
    });

    it('should handle 100% discount', () => {
      const fullDiscount = new Promotion(1, 'FREE', 100);
      expect(fullDiscount.applyDiscount(100)).toBe(0);
    });

    it('should handle decimal prices', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      expect(promotion.applyDiscount(99.99)).toBeCloseTo(79.992, 2);
    });
  });
});
