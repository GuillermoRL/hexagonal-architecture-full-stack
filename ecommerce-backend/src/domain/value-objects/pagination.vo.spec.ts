import { Pagination } from './pagination.vo';

describe('Pagination Value Object', () => {
  describe('constructor and validation', () => {
    it('should create valid pagination', () => {
      const pagination = new Pagination(0, 20);
      expect(pagination.page).toBe(0);
      expect(pagination.pageSize).toBe(20);
    });

    it('should throw error for negative page', () => {
      expect(() => new Pagination(-1, 20)).toThrow(
        'Page must be a non-negative number',
      );
    });

    it('should throw error for invalid pageSize', () => {
      expect(() => new Pagination(0, 0)).toThrow(
        'Page size must be a positive number',
      );
      expect(() => new Pagination(0, -5)).toThrow(
        'Page size must be a positive number',
      );
    });
  });

  describe('skip calculation', () => {
    it('should calculate correct skip value', () => {
      expect(new Pagination(0, 20).skip).toBe(0);
      expect(new Pagination(1, 20).skip).toBe(20);
      expect(new Pagination(2, 20).skip).toBe(40);
      expect(new Pagination(5, 10).skip).toBe(50);
    });
  });

  describe('take property', () => {
    it('should return pageSize as take', () => {
      expect(new Pagination(0, 20).take).toBe(20);
      expect(new Pagination(0, 50).take).toBe(50);
    });
  });

  describe('calculateTotalPages', () => {
    it('should calculate total pages correctly', () => {
      const pagination = new Pagination(0, 20);

      expect(pagination.calculateTotalPages(100)).toBe(5);
      expect(pagination.calculateTotalPages(99)).toBe(5);
      expect(pagination.calculateTotalPages(101)).toBe(6);
      expect(pagination.calculateTotalPages(0)).toBe(0);
      expect(pagination.calculateTotalPages(1)).toBe(1);
    });

    it('should handle different page sizes', () => {
      expect(new Pagination(0, 10).calculateTotalPages(100)).toBe(10);
      expect(new Pagination(0, 50).calculateTotalPages(100)).toBe(2);
      expect(new Pagination(0, 25).calculateTotalPages(100)).toBe(4);
    });
  });
});
