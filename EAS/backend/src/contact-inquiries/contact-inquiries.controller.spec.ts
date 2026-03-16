import { Test, TestingModule } from '@nestjs/testing';
import { ContactInquiriesController } from './contact-inquiries.controller';
import { ContactInquiriesService } from './contact-inquiries.service';

describe('ContactInquiriesController', () => {
  let controller: ContactInquiriesController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactInquiriesController],
      providers: [
        {
          provide: ContactInquiriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContactInquiriesController>(
      ContactInquiriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
