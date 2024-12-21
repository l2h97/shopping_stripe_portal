import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductService } from './createProduct/createProduct.service';
import { GetDataCacheService } from '../../guards/getDataCache.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [CreateProductService, GetDataCacheService],
  exports: [],
})
export class ProductModule {}
