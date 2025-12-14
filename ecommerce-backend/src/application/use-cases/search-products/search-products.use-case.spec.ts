import { SearchProductsUseCase } from './search-products.use-case';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';
import { Promotion } from '../../../domain/entities/promotion.entity';
import { SearchProductsInput } from './search-products.input';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepository = {
      search: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new SearchProductsUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return paginated results with products', async () => {
      const products = [
        new Product(1, 'Laptop', 'Gaming laptop', 1000, 'img1.jpg'),
        new Product(2, 'Mouse', 'Gaming mouse', 50, 'img2.jpg'),
      ];

      mockRepository.search.mockResolvedValue(products);
      mockRepository.count.mockResolvedValue(100);

      const input = new SearchProductsInput('laptop', 0, 20);
      const result = await useCase.execute(input);

      expect(result).toMatchObject({
        totalPages: 5,
        currentPage: 0,
        pageSize: 20,
        totalCount: 100,
      });
      expect(result.products).toHaveLength(2);
      expect(mockRepository.search).toHaveBeenCalledWith('laptop', 0, 20);
      expect(mockRepository.count).toHaveBeenCalledWith('laptop');
    });

    it('should apply palindrome discount when query is palindrome', async () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const products = [
        new Product(1, 'Radar Device', 'Radar sensor', 1000, null, promotion),
      ];

      mockRepository.search.mockResolvedValue(products);
      mockRepository.count.mockResolvedValue(1);

      const input = new SearchProductsInput('radar', 0, 20);
      const result = await useCase.execute(input);

      expect(result.products[0].isPalindromeDiscount).toBe(true);
      expect(result.products[0].promotion?.code).toBe('PALINDROME');
      expect(result.products[0].promotion?.discount).toBe(50);
    });

    it('should not apply palindrome discount for non-palindrome queries', async () => {
      const promotion = new Promotion(1, 'SAVE20', 20);
      const products = [
        new Product(1, 'Laptop', 'Gaming laptop', 1000, null, promotion),
      ];

      mockRepository.search.mockResolvedValue(products);
      mockRepository.count.mockResolvedValue(1);

      const input = new SearchProductsInput('laptop', 0, 20);
      const result = await useCase.execute(input);

      expect(result.products[0].isPalindromeDiscount).toBe(false);
      expect(result.products[0].promotion?.code).toBe('SAVE20');
      expect(result.products[0].promotion?.discount).toBe(20);
    });

    it('should keep better discount when palindrome is searched', async () => {
      const promotion = new Promotion(1, 'SAVE70', 70);
      const products = [
        new Product(1, 'Ana Product', 'Ana description', 1000, null, promotion),
      ];

      mockRepository.search.mockResolvedValue(products);
      mockRepository.count.mockResolvedValue(1);

      const input = new SearchProductsInput('ana', 0, 20);
      const result = await useCase.execute(input);

      expect(result.products[0].isPalindromeDiscount).toBe(false);
      expect(result.products[0].promotion?.discount).toBe(70);
    });

    it('should handle empty results', async () => {
      mockRepository.search.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      const input = new SearchProductsInput('nonexistent', 0, 20);
      const result = await useCase.execute(input);

      expect(result.products).toHaveLength(0);
      expect(result.totalPages).toBe(0);
      expect(result.totalCount).toBe(0);
    });

    it('should handle pagination correctly', async () => {
      mockRepository.search.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(47);

      const input = new SearchProductsInput('test', 2, 10);
      const result = await useCase.execute(input);

      expect(mockRepository.search).toHaveBeenCalledWith('test', 20, 10);
      expect(result.currentPage).toBe(2);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(5);
    });
  });
});
