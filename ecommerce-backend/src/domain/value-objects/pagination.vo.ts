export class Pagination {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.page < 0) {
      throw new Error('Page must be a non-negative number');
    }
    if (this.pageSize <= 0) {
      throw new Error('Page size must be a positive number');
    }
  }

  get skip(): number {
    return this.page * this.pageSize;
  }

  get take(): number {
    return this.pageSize;
  }

  calculateTotalPages(totalCount: number): number {
    return Math.ceil(totalCount / this.pageSize);
  }
}
