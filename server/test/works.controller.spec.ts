import { Test, TestingModule } from '@nestjs/testing';
import { WorksController } from '../src/works/works.controller';
import { WorksService } from '../src/works/works.service';
import { Work } from '../src/works/work.entity';
import { HttpException } from '@nestjs/common';

describe('WorksController', () => {
  let controller: WorksController;
  let service: WorksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorksController],
      providers: [
        {
          provide: WorksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorksController>(WorksController);
    service = module.get<WorksService>(WorksService);
  });

  it('ar trebui să fie definit', () => {
    expect(controller).toBeDefined();
  });

  it('ar trebui să creeze un work cu fișiere încărcate', async () => {
    const work: Partial<Work> = {
      title: 'Test Work',
      description: 'Test Description',
      images: [],
      workLink: 'http://example.com',
      status: 'visible',
    };
    const files = [
      { filename: 'image1.jpg' },
      { filename: 'image2.jpg' },
    ] as Express.Multer.File[];

    jest.spyOn(service, 'create').mockResolvedValue({
      ...work,
      images: files.map((f) => f.filename),
    } as Work);

    expect(await controller.create(work, files)).toEqual({
      ...work,
      images: ['image1.jpg', 'image2.jpg'],
    });
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

    jest.spyOn(service, 'findAll').mockResolvedValue(workArray);

    expect(await controller.findAll()).toEqual(workArray);
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

    jest.spyOn(service, 'findOne').mockResolvedValue(work);

    expect(await controller.findOne('1')).toEqual(work);
  });

  it('ar trebui să returneze null pentru un id care nu există', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    expect(await controller.findOne('999')).toBeNull();
  });

  it('ar trebui să actualizeze un work cu fișiere încărcate', async () => {
    const updatedWork: Work = {
      id: 1,
      title: 'Updated Work',
      description: 'Updated Description',
      images: ['newimage.jpg'],
      workLink: 'http://example1.com',
      status: 'visible',
    };

    const files = [{ filename: 'newimage.jpg' }] as Express.Multer.File[];

    jest.spyOn(service, 'update').mockResolvedValue(updatedWork);

    expect(
      await controller.update(
        '1',
        {
          title: 'Updated Work',
          description: 'Updated Description',
          images: [],
        },
        files,
      ),
    ).toEqual(updatedWork);
  });

  it('ar trebui să returneze eroare pentru actualizarea unui work inexistent', async () => {
    jest.spyOn(service, 'update').mockResolvedValue(null);

    await expect(
      controller.update('999', {
        title: 'Updated Work',
        description: 'Updated Description',
        images: [],
      }),
    ).rejects.toThrowError('Work not found');
  });

  it('ar trebui să elimine un work', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({ deleted: true });

    expect(await controller.remove('1')).toEqual({ deleted: true });
  });

  it('ar trebui să returneze eroare pentru eliminarea unui work inexistent', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({ deleted: false });

    await expect(controller.remove('999')).rejects.toThrowError(
      'Work not found',
    );
  });
});
