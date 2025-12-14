import { ProductRepository, SearchResult } from '@/domain/repositories/product.repository';

export class SearchProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: string | null, page: number = 0, pageSize: number = 20): Promise<SearchResult> {
    // If no query, return empty result
    if (!query || !query.trim()) {
      return {
        products: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0,
      };
    }

    return this.productRepository.search(query, page, pageSize);
  }
}
