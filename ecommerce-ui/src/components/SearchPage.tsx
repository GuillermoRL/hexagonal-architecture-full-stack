"use client";

import { useQueryState } from 'nuqs';
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { LoadingGrid } from "@/components/LoadingGrid";
import { useProductSearch } from "@/hooks/useProductSearch";

export const SearchPage = () => {
  const [query, setQuery] = useQueryState('query', {
    defaultValue: '',
    shallow: false,
  });

  const { products, isLoading, error, hasSearched } = useProductSearch(query);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 pt-16">
      {/* Search Bar */}
      <SearchBar
        query={query || ''}
        isLoading={isLoading}
        onQueryChange={setQuery}
      />

      {/* Loading Skeletons */}
      {isLoading && <LoadingGrid />}

      {/* Error Message */}
      {error && (
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">
            {error}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Por favor, intenta nuevamente
          </p>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && hasSearched && products.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground text-lg">
            No se encontraron productos
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};
