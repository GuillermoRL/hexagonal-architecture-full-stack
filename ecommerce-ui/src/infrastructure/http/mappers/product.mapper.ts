import { Product } from '@/domain/entities/product.entity';
import { Promotion } from '@/domain/entities/promotion.entity';

// API Response types
interface ApiPromotion {
  id: number;
  code: string;
  discount: number;
}

interface ApiProduct {
  id: number;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isPalindromeDiscount: boolean;
  promotion?: ApiPromotion;
}

export class ProductMapper {
  static toDomain(apiProduct: ApiProduct): Product {
    const promotion = apiProduct.promotion
      ? new Promotion(
          apiProduct.promotion.id,
          apiProduct.promotion.code,
          apiProduct.promotion.discount,
        )
      : undefined;

    return new Product(
      apiProduct.id,
      apiProduct.title,
      apiProduct.description,
      apiProduct.price,
      apiProduct.imageUrl,
      promotion,
      apiProduct.isPalindromeDiscount,
    );
  }

  static toDomainList(apiProducts: ApiProduct[]): Product[] {
    return apiProducts.map((apiProduct) => this.toDomain(apiProduct));
  }
}
