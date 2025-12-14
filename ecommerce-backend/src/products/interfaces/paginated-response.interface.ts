import { Product, Promotion } from 'generated/prisma/client';

export interface ProductWithPromotion extends Product {
  promotion: Promotion | null;
}

export interface PaginatedResponse {
  pages: number;
  page: number;
  size: number;
  products: ProductWithPromotion[];
}
