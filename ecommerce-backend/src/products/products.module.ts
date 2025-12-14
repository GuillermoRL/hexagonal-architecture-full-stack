import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SearchProductsUseCase } from '../application/use-cases/search-products/search-products.use-case';
import { PrismaProductRepository } from '../infrastructure/database/prisma/repositories/prisma-product.repository';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    ProductsService, // Keep old service for backward compatibility (can be removed later)
    SearchProductsUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductsModule {}
