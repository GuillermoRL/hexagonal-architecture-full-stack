import { Product } from '../../../domain/entities/product.entity';
import { ProductDto } from './search-products.output';

export class SearchProductsMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      finalPrice: product.finalPrice,
      isPalindromeDiscount: product.isPalindromeDiscount,
      promotion: product.promotion
        ? {
            id: product.promotion.id,
            code: product.promotion.code,
            discount: product.promotion.discount,
          }
        : undefined,
    };
  }

  static toDtoList(products: Product[]): ProductDto[] {
    return products.map((product) => this.toDto(product));
  }
}
