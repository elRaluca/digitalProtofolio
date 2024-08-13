// works.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './work.entity';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private worksRepository: Repository<Work>,
  ) {}

  create(work: Partial<Work>) {
    return this.worksRepository.save(work);
  }

  findAll() {
    return this.worksRepository.find();
  }

  findOne(id: number) {
    return this.worksRepository.findOneBy({ id });
  }

  async update(id: number, work: Partial<Work>) {
    await this.worksRepository.update(id, work);

    return this.worksRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const result = await this.worksRepository.delete(id);
    return { deleted: result.affected !== 0 };
  }
}
