import { Product } from '../entities/product.entity';

export interface SearchResult {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface ProductRepository {
  search(query: string, page: number, pageSize: number): Promise<SearchResult>;
}
