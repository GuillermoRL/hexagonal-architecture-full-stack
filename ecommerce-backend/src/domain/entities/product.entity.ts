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
  ) {
    this.validatePrice();
  }

  private validatePrice(): void {
    if (this.price < 0) {
      throw new Error('Price must be a positive number');
    }
  }

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

  /**
   * Applies palindrome discount (50%) if it's better than the current promotion
   * Returns a new Product instance with the palindrome discount applied
   */
  applyPalindromeDiscount(): Product {
    const PALINDROME_DISCOUNT = 50;

    // If no promotion or current promotion is less than 50%, apply palindrome discount
    if (!this.promotion || this.promotion.discount < PALINDROME_DISCOUNT) {
      const palindromePromotion = new Promotion(
        this.promotion?.id || 0,
        'PALINDROME',
        PALINDROME_DISCOUNT,
      );

      return new Product(
        this.id,
        this.title,
        this.description,
        this.price,
        this.imageUrl,
        palindromePromotion,
        true, // Mark as palindrome discount
      );
    }

    // Keep existing promotion if it's better
    return this;
  }
}
