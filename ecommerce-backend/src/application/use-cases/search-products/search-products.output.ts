export class ProductDto {
  id: number;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  finalPrice: number;
  isPalindromeDiscount: boolean;
  promotion?: {
    id: number;
    code: string;
    discount: number;
  };
}

export class SearchProductsOutput {
  products: ProductDto[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}
