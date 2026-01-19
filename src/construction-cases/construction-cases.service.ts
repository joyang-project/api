import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { ConstructionCase } from '../entities/construction-case.entity';

@Injectable()
export class ConstructionCasesService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(ConstructionCase)
    private readonly constructionCaseRepository: Repository<ConstructionCase>,
  ) {}

  async uploadAndConvert(file: Express.Multer.File) {
    await fs.mkdir(this.uploadPath, { recursive: true });

    const fileName = `${uuidv4()}.webp`;
    const fullPath = path.join(this.uploadPath, fileName);

    const info = await sharp(file.buffer)
      .webp({ quality: 80 })
      .toFile(fullPath);

    return {
      original_name: file.originalname,
      stored_name: fileName,
      image_url: `/uploads/${fileName}`,
      size: info.size,
      mimetype: 'image/webp',
    };
  }

  async saveToDb(data: any) {
    const newCase = this.constructionCaseRepository.create(data);
    return await this.constructionCaseRepository.save(newCase);
  }
}