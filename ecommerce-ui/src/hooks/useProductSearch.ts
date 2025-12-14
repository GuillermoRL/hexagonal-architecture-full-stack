import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/domain/entities/product.entity';
import { SearchProductsUseCase } from '@/application/use-cases/search-products/search-products.use-case';
import { HttpProductRepository } from '@/infrastructure/http/repositories/http-product.repository';

interface UseProductSearchReturn {
  products: Product[];
  isLoading: boolean;
  error: string;
  hasSearched: boolean;
}

export const useProductSearch = (query: string | null): UseProductSearchReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Create use case instance (memoized to avoid recreating on each render)
  const searchProductsUseCase = useMemo(() => {
    const repository = new HttpProductRepository();
    return new SearchProductsUseCase(repository);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query || !query.trim()) {
        setProducts([]);
        setHasSearched(false);
        return;
      }

      setError('');
      setIsLoading(true);
      setHasSearched(true);

      try {
        const result = await searchProductsUseCase.execute(query, 0, 20);
        setProducts(result.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al buscar productos';
        setError(errorMessage);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [query, searchProductsUseCase]);

  return {
    products,
    isLoading,
    error,
    hasSearched,
  };
};
