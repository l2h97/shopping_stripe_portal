import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prismaService/prisma.service';
import { LoggerService } from '../../services/loggerService/logger.service';
import { Prisma } from '@prisma/client';

export const storeInclude = Prisma.validator<Prisma.StoreInclude>()({
  owner: {
    include: {
      profileImage: true,
      coverImage: true,
    },
  },
  profileImage: true,
  coverImage: true,
});

export type StoreIncludeType = Prisma.StoreGetPayload<{
  include: typeof storeInclude;
}>;

@Injectable()
export class StoreRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(
    data: Prisma.StoreCreateInput,
  ): Promise<StoreIncludeType | null> {
    try {
      return await this.prismaService.store.create({
        data,
        include: storeInclude,
      });
    } catch (err) {
      this.loggerService.error('🚀 ~ StoreRepository ~ create ~ err:', err);

      return null;
    }
  }

  async update(
    id: number,
    data: Prisma.StoreUpdateInput,
  ): Promise<StoreIncludeType | null> {
    try {
      return await this.prismaService.store.update({
        data,
        where: {
          id,
        },
        include: storeInclude,
      });
    } catch (err) {
      this.loggerService.error('🚀 ~ StoreRepository ~ update ~ err:', err);

      return null;
    }
  }
}
