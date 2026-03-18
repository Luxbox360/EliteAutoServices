import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class ContactInquiriesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(data: Partial<typeof schema.contactInquiry.$inferInsert>) {
    // Sanitizamos la data para garantizar que no haya campos requeridos omitidos
    // o datos basura que rompan el query de Drizzle.
    const safeData: typeof schema.contactInquiry.$inferInsert = {
      name: data.name || 'Anonymous',
      email: data.email || 'No email provided',
      phone: data.phone || null,
      message: data.message || 'No message content',
      vehicle_id: data.vehicle_id || null,
      status: 'new',
    };

    const result = await this.db
      .insert(schema.contactInquiry)
      .values(safeData)
      .returning();
    return result[0];
  }

  async findAll() {
    return this.db.query.contactInquiry.findMany({
      orderBy: [desc(schema.contactInquiry.created_at)],
    });
  }

  async findOne(id: number) {
    return this.db.query.contactInquiry.findFirst({
      where: eq(schema.contactInquiry.id, id),
    });
  }

  async update(
    id: number,
    data: Partial<typeof schema.contactInquiry.$inferInsert>,
  ) {
    const result = await this.db
      .update(schema.contactInquiry)
      .set(data)
      .where(eq(schema.contactInquiry.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const result = await this.db
      .delete(schema.contactInquiry)
      .where(eq(schema.contactInquiry.id, id))
      .returning();
    return result[0];
  }
}
