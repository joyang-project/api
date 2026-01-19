import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConstructionCasesService } from './construction-cases.service';

@Controller('construction-cases')
export class ConstructionCasesController {
  constructor(private readonly constructionCasesService: ConstructionCasesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: any,
  ) {
    const imageInfo = await this.constructionCasesService.uploadAndConvert(file);
    
    // DB 저장 로직 (saveToDb 메서드 구현 후 연결)
    return this.constructionCasesService.saveToDb({ ...createDto, ...imageInfo });
  }
}