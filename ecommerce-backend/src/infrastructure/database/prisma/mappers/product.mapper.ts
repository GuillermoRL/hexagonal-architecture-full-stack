import { Product } from '../../../../domain/entities/product.entity';
import { Promotion } from '../../../../domain/entities/promotion.entity';

type PrismaProduct = {
  id: number;
  title: string;
  description: string | null;
  price: any; // Prisma Decimal
  image_url: string | null;
  promo_id: number | null;
  promotion?: {
    id: number;
    code: string;
    discount: number;
  } | null;
};

export class ProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    const promotion = raw.promotion
      ? new Promotion(raw.promotion.id, raw.promotion.code, raw.promotion.discount)
      : undefined;

    return new Product(
      raw.id,
      raw.title,
      raw.description,
      Number(raw.price), // Convert Decimal to number
      raw.image_url,
      promotion,
    );
  }

  static toDomainList(rawList: PrismaProduct[]): Product[] {
    return rawList.map((raw) => this.toDomain(raw));
  }
}
