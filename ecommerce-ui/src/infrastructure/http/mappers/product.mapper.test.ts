import { describe, it, expect } from 'vitest';
import { ProductMapper } from './product.mapper';

describe('ProductMapper (Frontend)', () => {
  describe('toDomain', () => {
    it('should map API product without promotion', () => {
      const apiProduct = {
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        imageUrl: 'image.jpg',
        isPalindromeDiscount: false,
      };

      const product = ProductMapper.toDomain(apiProduct);

      expect(product).toMatchObject({
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        imageUrl: 'image.jpg',
        isPalindromeDiscount: false,
        promotion: undefined,
      });
    });

    it('should map API product with promotion', () => {
      const apiProduct = {
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        imageUrl: 'image.jpg',
        isPalindromeDiscount: false,
        promotion: {
          id: 1,
          code: 'SAVE20',
          discount: 20,
        },
      };

      const product = ProductMapper.toDomain(apiProduct);

      expect(product.promotion).toBeDefined();
      expect(product.promotion?.code).toBe('SAVE20');
      expect(product.promotion?.discount).toBe(20);
    });

    it('should map product with palindrome discount', () => {
      const apiProduct = {
        id: 1,
        title: 'Radar',
        description: null,
        price: 1000,
        imageUrl: null,
        isPalindromeDiscount: true,
        promotion: {
          id: 1,
          code: 'PALINDROME',
          discount: 50,
        },
      };

      const product = ProductMapper.toDomain(apiProduct);

      expect(product.isPalindromeDiscount).toBe(true);
      expect(product.promotion?.code).toBe('PALINDROME');
    });

    it('should handle null description and imageUrl', () => {
      const apiProduct = {
        id: 1,
        title: 'Product',
        description: null,
        price: 100,
        imageUrl: null,
        isPalindromeDiscount: false,
      };

      const product = ProductMapper.toDomain(apiProduct);

      expect(product.description).toBeNull();
      expect(product.imageUrl).toBeNull();
    });
  });

  describe('toDomainList', () => {
    it('should map array of API products', () => {
      const apiProducts = [
        {
          id: 1,
          title: 'Laptop',
          description: 'Gaming laptop',
          price: 1000,
          imageUrl: 'img1.jpg',
          isPalindromeDiscount: false,
        },
        {
          id: 2,
          title: 'Mouse',
          description: 'Gaming mouse',
          price: 50,
          imageUrl: 'img2.jpg',
          isPalindromeDiscount: false,
        },
      ];

      const products = ProductMapper.toDomainList(apiProducts);

      expect(products).toHaveLength(2);
      expect(products[0].title).toBe('Laptop');
      expect(products[1].title).toBe('Mouse');
    });

    it('should map empty array', () => {
      const products = ProductMapper.toDomainList([]);
      expect(products).toEqual([]);
    });
  });
});
