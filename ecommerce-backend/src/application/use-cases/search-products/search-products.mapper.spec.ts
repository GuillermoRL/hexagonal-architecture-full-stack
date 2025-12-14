import { SearchProductsMapper } from './search-products.mapper';
import { Product } from '../../../domain/entities/product.entity';
import { Promotion } from '../../../domain/entities/promotion.entity';

describe('SearchProductsMapper', () => {
  describe('toDto', () => {
    it('should map product without promotion', () => {
      const product = new Product(
        1,
        'Laptop',
        'Gaming laptop',
        1000,
        'image.jpg',
      );

      const dto = SearchProductsMapper.toDto(product);

      expect(dto).toMatchObject({
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        imageUrl: 'image.jpg',
        finalPrice: 1000,
        isPalindromeDiscount: false,
        promotion: undefined,
      });
    });

    it('should map product with promotion', () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const product = new Product(
        1,
        'Laptop',
        'Gaming laptop',
        1000,
        'image.jpg',
        promotion,
      );

      const dto = SearchProductsMapper.toDto(product);

      expect(dto).toMatchObject({
        id: 1,
        finalPrice: 800,
        isPalindromeDiscount: false,
        promotion: {
          id: 1,
          code: 'SAVE20',
          discount: 20,
        },
      });
    });

    it('should map product with palindrome discount', () => {
      const promotion = new Promotion(1, 'PALINDROME', 50);
      const product = new Product(
        1,
        'Radar',
        'Radar device',
        1000,
        null,
        promotion,
        true,
      );

      const dto = SearchProductsMapper.toDto(product);

      expect(dto).toMatchObject({
        isPalindromeDiscount: true,
        promotion: {
          code: 'PALINDROME',
          discount: 50,
        },
      });
    });
  });

  describe('toDtoList', () => {
    it('should map array of products', () => {
      const products = [
        new Product(1, 'Laptop', 'Gaming laptop', 1000, 'img1.jpg'),
        new Product(2, 'Mouse', 'Gaming mouse', 50, 'img2.jpg'),
      ];

      const dtos = SearchProductsMapper.toDtoList(products);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].title).toBe('Laptop');
      expect(dtos[1].title).toBe('Mouse');
    });

    it('should map empty array', () => {
      const dtos = SearchProductsMapper.toDtoList([]);
      expect(dtos).toEqual([]);
    });
  });
});
