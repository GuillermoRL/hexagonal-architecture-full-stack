import { Injectable, Inject } from '@nestjs/common';
import { ProductRepository, PRODUCT_REPOSITORY } from '../../../domain/repositories/product.repository';
import { Pagination } from '../../../domain/value-objects/pagination.vo';
import { SearchQuery } from '../../../domain/value-objects/search-query.vo';
import { SearchProductsInput } from './search-products.input';
import { SearchProductsOutput } from './search-products.output';
import { SearchProductsMapper } from './search-products.mapper';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: SearchProductsInput): Promise<SearchProductsOutput> {
    const pagination = new Pagination(input.page, input.pageSize);
    const searchQuery = new SearchQuery(input.query);

    const [products, totalCount] = await Promise.all([
      this.productRepository.search(
        input.query,
        pagination.skip,
        pagination.take,
      ),
      this.productRepository.count(input.query),
    ]);

    // Apply palindrome discount if the search query is a palindrome
    const processedProducts = searchQuery.isPalindrome()
      ? products.map((product) => product.applyPalindromeDiscount())
      : products;

    const totalPages = pagination.calculateTotalPages(totalCount);

    return {
      products: SearchProductsMapper.toDtoList(processedProducts),
      totalPages,
      currentPage: input.page,
      pageSize: input.pageSize,
      totalCount,
    };
  }
}
