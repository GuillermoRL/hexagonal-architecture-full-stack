import axios from 'axios';
import { ProductRepository, SearchResult } from '@/domain/repositories/product.repository';
import { ProductMapper } from '../mappers/product.mapper';

export class HttpProductRepository implements ProductRepository {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  async search(query: string, page: number, pageSize: number): Promise<SearchResult> {
    const response = await axios.get(`${this.apiUrl}/api/products`, {
      params: { query, page, pageSize },
    });

    const products = ProductMapper.toDomainList(response.data.products);

    return {
      products,
      totalPages: response.data.totalPages || response.data.pages, // Support both field names
      currentPage: response.data.currentPage || response.data.page,
      totalCount: response.data.totalCount || 0,
    };
  }
}
