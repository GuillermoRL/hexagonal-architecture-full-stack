import { Promotion } from './promotion.entity';

export class Product {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string | null,
    public readonly price: number,
    public readonly imageUrl: string | null,
    public readonly promotion?: Promotion,
    public readonly isPalindromeDiscount: boolean = false,
  ) {}

  get finalPrice(): number {
    if (!this.promotion) {
      return this.price;
    }
    return this.promotion.applyDiscount(this.price);
  }

  hasPromotion(): boolean {
    return this.promotion !== undefined;
  }

  getDiscountAmount(): number {
    if (!this.promotion) {
      return 0;
    }
    return this.price - this.finalPrice;
  }

  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }

  getFormattedFinalPrice(): string {
    return `$${this.finalPrice.toFixed(2)}`;
  }
}
