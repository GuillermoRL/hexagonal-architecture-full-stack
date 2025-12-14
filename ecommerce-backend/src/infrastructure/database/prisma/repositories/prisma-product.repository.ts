import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { Product } from '../../../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, skip: number, take: number): Promise<Product[]> {
    const whereClause = query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: {
        promotion: true,
      },
      skip,
      take,
    });

    return ProductMapper.toDomainList(products);
  }

  async count(query: string): Promise<number> {
    const whereClause = query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    return this.prisma.product.count({
      where: whereClause,
    });
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        promotion: true,
      },
    });

    if (!product) {
      return null;
    }

    return ProductMapper.toDomain(product);
  }
}
