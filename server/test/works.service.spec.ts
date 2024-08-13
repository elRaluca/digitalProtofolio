// works.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { WorksService } from '../src/works/works.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Work } from '../src/works/work.entity';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

describe('WorksService', () => {
  let service: WorksService;
  let repository: Repository<Work>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorksService,
        {
          provide: getRepositoryToken(Work),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WorksService>(WorksService);
    repository = module.get<Repository<Work>>(getRepositoryToken(Work));
  });

  it('ar trebui să fie definit', () => {
    expect(service).toBeDefined();
  });

  it('ar trebui să creeze un work', async () => {
    const work: Partial<Work> = {
      title: 'Test Work',
      description: 'Test Description',
      images: [],
      workLink: 'http://example.com',
      status: 'visible',
    };

    jest.spyOn(repository, 'save').mockResolvedValue(work as Work);

    expect(await service.create(work)).toEqual(work);
  });

  it('ar trebui să returneze toate works', async () => {
    const workArray: Work[] = [
      {
        id: 1,
        title: 'Work 1',
        description: 'Description 1',
        images: [],
        workLink: 'http://example1.com',
        status: 'visible',
      },
      {
        id: 2,
        title: 'Work 2',
        description: 'Description 2',
        images: [],
        workLink: 'http://example2.com',
        status: 'hidden',
      },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(workArray);

    expect(await service.findAll()).toEqual(workArray);
  });

  it('ar trebui să găsească un work după id', async () => {
    const work: Work = {
      id: 1,
      title: 'Work 1',
      description: 'Description 1',
      images: [],
      workLink: 'http://example1.com',
      status: 'visible',
    };

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(work);

    expect(await service.findOne(1)).toEqual(work);
  });

  it('ar trebui să returneze null pentru un id care nu există', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    expect(await service.findOne(999)).toBeNull();
  });

  it('ar trebui să actualizeze un work', async () => {
    const updatedWork: Work = {
      id: 1,
      title: 'Updated Work',
      description: 'Updated Description',
      images: [],
      workLink: 'http://example1.com',
      status: 'visible',
    };

    jest
      .spyOn(repository, 'update')
      .mockResolvedValue({ affected: 1 } as UpdateResult);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedWork);

    expect(
      await service.update(1, {
        title: 'Updated Work',
        description: 'Updated Description',
      }),
    ).toEqual(updatedWork);
  });

  it('ar trebui să returneze null când încearcă să actualizeze un work care nu există', async () => {
    jest
      .spyOn(repository, 'update')
      .mockResolvedValue({ affected: 0 } as UpdateResult);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    expect(
      await service.update(999, {
        title: 'Updated Work',
        description: 'Updated Description',
      }),
    ).toBeNull();
  });

  it('ar trebui să elimine un work', async () => {
    const deleteResult: DeleteResult = { raw: [], affected: 1 };
    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

    expect(await service.remove(1)).toEqual({ deleted: true });
  });

  it('ar trebui să returneze false dacă eliminarea unui work nu are efect', async () => {
    const deleteResult: DeleteResult = { raw: [], affected: 0 };
    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

    expect(await service.remove(999)).toEqual({ deleted: false });
  });
});
