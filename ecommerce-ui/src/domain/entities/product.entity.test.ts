import { describe, it, expect } from 'vitest';
import { Product } from './product.entity';
import { Promotion } from './promotion.entity';

describe('Product Entity (Frontend)', () => {
  describe('finalPrice', () => {
    it('should return original price without promotion', () => {
      const product = new Product(1, 'Laptop', 'Gaming laptop', 1000, null);
      expect(product.finalPrice).toBe(1000);
    });

    it('should return discounted price with promotion', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);

      expect(product.finalPrice).toBe(800);
    });
  });

  describe('hasPromotion', () => {
    it('should return true when promotion exists', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);

      expect(product.hasPromotion()).toBe(true);
    });

    it('should return false when no promotion', () => {
      const product = new Product(1, 'Laptop', null, 1000, null);
      expect(product.hasPromotion()).toBe(false);
    });
  });

  describe('getFormattedPrice', () => {
    it('should format price with $ and 2 decimals', () => {
      const product = new Product(1, 'Laptop', null, 1000, null);
      expect(product.getFormattedPrice()).toBe('$1000.00');
    });

    it('should handle decimal prices', () => {
      const product = new Product(1, 'Mouse', null, 49.99, null);
      expect(product.getFormattedPrice()).toBe('$49.99');
    });
  });

  describe('getFormattedFinalPrice', () => {
    it('should format final price', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);

      expect(product.getFormattedFinalPrice()).toBe('$800.00');
    });
  });

  describe('isPalindromeDiscount', () => {
    it('should default to false', () => {
      const product = new Product(1, 'Laptop', null, 1000, null);
      expect(product.isPalindromeDiscount).toBe(false);
    });

    it('should be true when provided', () => {
      const promotion = new Promotion(1, 'PALINDROME', 50);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion, true);

      expect(product.isPalindromeDiscount).toBe(true);
    });
  });
});
