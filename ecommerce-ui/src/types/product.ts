export interface Promotion {
  id: string;
  code: string;
  discount: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  promo_id: string;
  image_url?: string;
  promotion?: Promotion;
}
