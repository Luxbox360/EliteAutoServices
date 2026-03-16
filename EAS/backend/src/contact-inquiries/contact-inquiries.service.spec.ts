import { Test, TestingModule } from '@nestjs/testing';
import { ContactInquiriesService } from './contact-inquiries.service';
import { DRIZZLE } from '../db/drizzle.provider';

describe('ContactInquiriesService', () => {
  let service: ContactInquiriesService;

  const mockDrizzle = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    query: {
      contactInquiry: {
        findMany: jest.fn().mockReturnValue([]),
        findFirst: jest.fn().mockReturnValue(null),
      },
    },
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactInquiriesService,
        {
          provide: DRIZZLE,
          useValue: mockDrizzle,
        },
      ],
    }).compile();

    service = module.get<ContactInquiriesService>(ContactInquiriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
