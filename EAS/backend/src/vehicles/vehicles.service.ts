import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class VehiclesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateVehicleDto) {
    const values: typeof schema.vehicle.$inferInsert = {
      ...data,
      price: data.price.toString(),
    };
    const result = await this.db
      .insert(schema.vehicle)
      .values(values)
      .returning();
    return result[0];
  }

  async findAll() {
    return this.db.query.vehicle.findMany({
      orderBy: [desc(schema.vehicle.created_at)],
      columns: {
        id: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        type: true,
        color: true,
        mileage: true,
        price: true,
        image_main: true,
        status: true,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.db.query.vehicle.findFirst({
      where: eq(schema.vehicle.id, id),
      columns: {
        id: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        type: true,
        color: true,
        mileage: true,
        price: true,
        title_status: true,
        transmission: true,
        engine: true,
        image_main: true,
        images: true,
        specs: true,
        description: true,
        status: true,
      },
    });

    if (!result) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return result;
  }

  async update(id: number, data: UpdateVehicleDto) {
    const { price, ...rest } = data;
    const values: Partial<typeof schema.vehicle.$inferInsert> = { ...rest };
    if (price !== undefined) {
      values.price = price.toString();
    }

    const result = await this.db
      .update(schema.vehicle)
      .set(values)
      .where(eq(schema.vehicle.id, id))
      .returning();
    return result[0];
  }

  async remove(id: number) {
    const result = await this.db
      .delete(schema.vehicle)
      .where(eq(schema.vehicle.id, id))
      .returning();
    return result[0];
  }
}
