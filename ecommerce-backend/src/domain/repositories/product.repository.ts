import { Product } from '../entities/product.entity';

export interface ProductRepository {
  search(query: string, skip: number, take: number): Promise<Product[]>;
  count(query: string): Promise<number>;
  findById(id: number): Promise<Product | null>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
