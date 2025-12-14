export class Promotion {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly discount: number,
  ) {
    this.validateDiscount();
  }

  private validateDiscount(): void {
    if (this.discount < 0 || this.discount > 100) {
      throw new Error('Discount must be between 0 and 100');
    }
  }

  applyDiscount(price: number): number {
    return price - (price * this.discount) / 100;
  }
}
