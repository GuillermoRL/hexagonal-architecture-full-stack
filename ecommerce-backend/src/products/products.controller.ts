import { Controller, Get, Query } from '@nestjs/common';
import { SearchProductsUseCase } from '../application/use-cases/search-products/search-products.use-case';
import { SearchProductsInput } from '../application/use-cases/search-products/search-products.input';
import { SearchProductsOutput } from '../application/use-cases/search-products/search-products.output';

@Controller('products')
export class ProductsController {
  constructor(private readonly searchProductsUseCase: SearchProductsUseCase) {}

  @Get()
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<SearchProductsOutput> {
    const input = new SearchProductsInput(
      query || '',
      page !== undefined ? Number(page) : 0,
      pageSize !== undefined ? Number(pageSize) : 20,
    );

    return this.searchProductsUseCase.execute(input);
  }
}
