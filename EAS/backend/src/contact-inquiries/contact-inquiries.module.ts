import { Module } from '@nestjs/common';
import { ContactInquiriesService } from './contact-inquiries.service';
import { ContactInquiriesController } from './contact-inquiries.controller';

@Module({
  providers: [ContactInquiriesService],
  controllers: [ContactInquiriesController],
})
export class ContactInquiriesModule {}
