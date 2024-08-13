import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { WorksService } from './works.service';
import { Work } from './work.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

const storageOptions = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const filesInterceptor = FilesInterceptor('images', 10, {
  storage: storageOptions,
});

function parseJsonArray(input: string): string[] | null {
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Post()
  @UseInterceptors(filesInterceptor)
  async create(
    @Body() createWorkDto: Partial<Work>,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      createWorkDto.images = files.map((file) => file.filename);
    }

    if (createWorkDto.images && typeof createWorkDto.images === 'string') {
      const urls = parseJsonArray(createWorkDto.images);
      if (urls) {
        createWorkDto.images = urls;
      } else {
        throw new Error('Invalid image URLs format');
      }
    }

    return this.worksService.create(createWorkDto);
  }

  @Get()
  findAll() {
    return this.worksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    return this.worksService.findOne(numericId);
  }

  @Put(':id')
  @UseInterceptors(filesInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateWorkDto: Partial<Work>,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      if (files && files.length > 0) {
        updateWorkDto.images = files.map((file) => file.filename);
      }

      if (updateWorkDto.images && typeof updateWorkDto.images === 'string') {
        const urls = parseJsonArray(updateWorkDto.images);
        if (urls) {
          updateWorkDto.images = [...(updateWorkDto.images || []), ...urls];
        }
      }

      const numericId = parseInt(id, 10);
      const updatedWork = await this.worksService.update(
        numericId,
        updateWorkDto,
      );

      if (!updatedWork) {
        throw new HttpException('Work not found', HttpStatus.NOT_FOUND);
      }

      return updatedWork;
    } catch (error) {
      console.error(`Error updating work with ID ${id}:`, error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    const result = await this.worksService.remove(numericId);

    if (!result.deleted) {
      throw new HttpException('Work not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
