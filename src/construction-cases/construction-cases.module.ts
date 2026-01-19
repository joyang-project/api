import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionCasesController } from './construction-cases.controller';
import { ConstructionCasesService } from './construction-cases.service';
import { ConstructionCase } from '../entities/construction-case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConstructionCase])],
  controllers: [ConstructionCasesController],
  providers: [ConstructionCasesService],
})
export class ConstructionCasesModule {}
