import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(queryDto: QueryProductsDto): Promise<PaginatedResponse> {
    const { query, page = 0, pageSize = 20 } = queryDto;
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

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        include: {
          promotion: true,
        },
        skip: page * pageSize,
        take: pageSize,
      }),
      this.prisma.product.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      pages: totalPages,
      page: page,
      size: products.length,
      products: products,
    };
  }
}
