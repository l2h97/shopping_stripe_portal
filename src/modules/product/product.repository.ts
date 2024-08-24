import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prismaService/prisma.service';
import { Prisma } from '@prisma/client';
import { LoggerService } from '../../services/loggerService/logger.service';

const productInclude = Prisma.validator<Prisma.ProductInclude>()({
  store: {
    include: {
      profileImage: true,
      coverImage: true,
    },
  },
  media: true,
  createdBy: {
    include: {
      profileImage: true,
      coverImage: true,
    },
  },
});

export type ProductInclude = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

@Injectable()
export class ProductRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(data: Prisma.ProductCreateInput) {
    try {
      return await this.prismaService.product.create({
        data,
        include: productInclude,
      });
    } catch (error) {
      this.loggerService.error('🚀 ~ ProductRepository ~ create ~ err:', error);
      return null;
    }
  }
}