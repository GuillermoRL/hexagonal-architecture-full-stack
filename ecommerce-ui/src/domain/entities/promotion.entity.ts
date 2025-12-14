export class Promotion {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly discount: number,
  ) {}

  applyDiscount(price: number): number {
    return price - (price * this.discount) / 100;
  }
}
