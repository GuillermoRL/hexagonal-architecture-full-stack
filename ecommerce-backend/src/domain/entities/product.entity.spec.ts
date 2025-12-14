import { Product } from './product.entity';
import { Promotion } from './promotion.entity';

describe('Product Entity', () => {
  describe('constructor and validation', () => {
    it('should create product without promotion', () => {
      const product = new Product(
        1,
        'Laptop',
        'Gaming laptop',
        1000,
        'image.jpg',
      );

      expect(product).toMatchObject({
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        imageUrl: 'image.jpg',
        promotion: undefined,
        isPalindromeDiscount: false,
      });
    });

    it('should create product with promotion', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(
        1,
        'Laptop',
        'Gaming laptop',
        1000,
        'image.jpg',
        promotion,
      );

      expect(product.promotion).toBe(promotion);
    });

    it('should throw error for negative price', () => {
      expect(
        () => new Product(1, 'Laptop', 'Gaming laptop', -100, 'image.jpg'),
      ).toThrow('Price must be a positive number');
    });
  });

  describe('finalPrice', () => {
    it('should return original price without promotion', () => {
      const product = new Product(1, 'Laptop', 'Gaming laptop', 1000, null);
      expect(product.finalPrice).toBe(1000);
    });

    it('should return discounted price with promotion', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(
        1,
        'Laptop',
        null,
        1000,
        null,
        promotion,
      );

      expect(product.finalPrice).toBe(800);
    });

    it('should calculate with 50% discount', () => {
      const promotion = new Promotion(1, 'HALF', 50);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);

      expect(product.finalPrice).toBe(500);
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

  describe('getDiscountAmount', () => {
    it('should return 0 without promotion', () => {
      const product = new Product(1, 'Laptop', null, 1000, null);
      expect(product.getDiscountAmount()).toBe(0);
    });

    it('should calculate discount amount correctly', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);

      expect(product.getDiscountAmount()).toBe(200);
    });
  });

  describe('applyPalindromeDiscount', () => {
    it('should apply 50% discount when no promotion exists', () => {
      const product = new Product(1, 'Laptop', null, 1000, null);
      const result = product.applyPalindromeDiscount();

      expect(result.isPalindromeDiscount).toBe(true);
      expect(result.promotion?.code).toBe('PALINDROME');
      expect(result.promotion?.discount).toBe(50);
      expect(result.finalPrice).toBe(500);
    });

    it('should replace promotion when current discount < 50%', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);
      const result = product.applyPalindromeDiscount();

      expect(result.isPalindromeDiscount).toBe(true);
      expect(result.promotion?.code).toBe('PALINDROME');
      expect(result.promotion?.discount).toBe(50);
      expect(result.finalPrice).toBe(500);
    });

    it('should keep original promotion when discount >= 50%', () => {
      const promotion = new Promotion(1, 'SAVE70', 70);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);
      const result = product.applyPalindromeDiscount();

      expect(result.isPalindromeDiscount).toBe(false);
      expect(result.promotion?.code).toBe('SAVE70');
      expect(result.promotion?.discount).toBe(70);
      expect(result.finalPrice).toBe(300);
    });

    it('should keep original when discount is exactly 50%', () => {
      const promotion = new Promotion(1, 'HALF', 50);
      const product = new Product(1, 'Laptop', null, 1000, null, promotion);
      const result = product.applyPalindromeDiscount();

      expect(result.isPalindromeDiscount).toBe(false);
      expect(result.promotion?.code).toBe('HALF');
    });

    it('should return new instance (immutability)', () => {
      const product = new Product(1, 'Laptop', null, 1000, null);
      const result = product.applyPalindromeDiscount();

      expect(result).not.toBe(product);
      expect(product.isPalindromeDiscount).toBe(false);
    });
  });
});
