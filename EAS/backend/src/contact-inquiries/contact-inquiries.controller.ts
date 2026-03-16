import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactInquiriesService } from './contact-inquiries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contact-inquiries')
export class ContactInquiriesController {
  constructor(
    private readonly contactInquiriesService: ContactInquiriesService,
  ) {}

  @Post()
  create(@Body() data: any) {
    return this.contactInquiriesService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactInquiriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactInquiriesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.contactInquiriesService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactInquiriesService.remove(+id);
  }
}
