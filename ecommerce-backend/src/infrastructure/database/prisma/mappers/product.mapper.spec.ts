import { ProductMapper } from './product.mapper';

describe('ProductMapper (Infrastructure)', () => {
  describe('toDomain', () => {
    it('should map Prisma product without promotion to domain entity', () => {
      const prismaProduct = {
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        image_url: 'image.jpg',
        promo_id: null,
        promotion: null,
      };

      const product = ProductMapper.toDomain(prismaProduct);

      expect(product).toMatchObject({
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        imageUrl: 'image.jpg',
        promotion: undefined,
      });
    });

    it('should map Prisma product with promotion to domain entity', () => {
      const prismaProduct = {
        id: 1,
        title: 'Laptop',
        description: 'Gaming laptop',
        price: 1000,
        image_url: 'image.jpg',
        promo_id: 1,
        promotion: {
          id: 1,
          code: 'SAVE20',
          discount: 20,
        },
      };

      const product = ProductMapper.toDomain(prismaProduct);

      expect(product).toMatchObject({
        id: 1,
        title: 'Laptop',
        price: 1000,
        imageUrl: 'image.jpg',
      });
      expect(product.promotion).toBeDefined();
      expect(product.promotion?.code).toBe('SAVE20');
      expect(product.promotion?.discount).toBe(20);
    });

    it('should convert Prisma Decimal to number', () => {
      const prismaProduct = {
        id: 1,
        title: 'Product',
        description: null,
        price: { toNumber: () => 99.99 }, // Mock Decimal
        image_url: null,
        promo_id: null,
        promotion: null,
      };

      const product = ProductMapper.toDomain(prismaProduct as any);

      expect(typeof product.price).toBe('number');
    });

    it('should handle null description and image_url', () => {
      const prismaProduct = {
        id: 1,
        title: 'Product',
        description: null,
        price: 100,
        image_url: null,
        promo_id: null,
        promotion: null,
      };

      const product = ProductMapper.toDomain(prismaProduct);

      expect(product.description).toBeNull();
      expect(product.imageUrl).toBeNull();
    });
  });

  describe('toDomainList', () => {
    it('should map array of Prisma products', () => {
      const prismaProducts = [
        {
          id: 1,
          title: 'Laptop',
          description: 'Gaming laptop',
          price: 1000,
          image_url: 'img1.jpg',
          promo_id: null,
          promotion: null,
        },
        {
          id: 2,
          title: 'Mouse',
          description: 'Gaming mouse',
          price: 50,
          image_url: 'img2.jpg',
          promo_id: null,
          promotion: null,
        },
      ];

      const products = ProductMapper.toDomainList(prismaProducts);

      expect(products).toHaveLength(2);
      expect(products[0].title).toBe('Laptop');
      expect(products[1].title).toBe('Mouse');
    });

    it('should map empty array', () => {
      const products = ProductMapper.toDomainList([]);
      expect(products).toEqual([]);
    });
  });
});
