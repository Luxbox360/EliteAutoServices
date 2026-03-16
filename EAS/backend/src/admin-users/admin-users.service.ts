import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class AdminUsersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateAdminUserDto) {
    const result = await this.db
      .insert(schema.adminUsers)
      .values(data)
      .returning();
    return result[0];
  }

  async findAll() {
    return this.db.query.adminUsers.findMany();
  }

  async findOne(id: number) {
    const result = await this.db.query.adminUsers.findFirst({
      where: eq(schema.adminUsers.id, id),
    });
    return result;
  }

  async findOneByUsername(username: string) {
    return this.db.query.adminUsers.findFirst({
      where: eq(schema.adminUsers.username, username),
    });
  }

  async update(id: number, data: UpdateAdminUserDto) {
    const result = await this.db
      .update(schema.adminUsers)
      .set(data)
      .where(eq(schema.adminUsers.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const result = await this.db
      .delete(schema.adminUsers)
      .where(eq(schema.adminUsers.id, id))
      .returning();
    return result[0];
  }
}
