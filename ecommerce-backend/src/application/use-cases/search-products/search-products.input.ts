export class SearchProductsInput {
  constructor(
    public readonly query: string = '',
    public readonly page: number = 0,
    public readonly pageSize: number = 20,
  ) {}
}
