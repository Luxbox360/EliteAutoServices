import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool, { schema });

  console.log('Seeding vehicles...');

  const vehicles = [
    {
      vin: '1G1AL5E10D7123456',
      make: 'Chevrolet',
      model: 'Colorado',
      year: 2022,
      type: 'Truck',
      color: 'Sand',
      mileage: 15000,
      price: '32000.00',
      image_main: 'chevy-colorado.jpg',
      status: 'available',
      featured: true,
      description: 'Rugged and reliable pickup truck.',
    },
    {
      vin: '1G1AL5E10D7654321',
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      type: 'Sedan',
      color: 'Blue',
      mileage: 22000,
      price: '24500.00',
      image_main: 'toyota-camry.jpg',
      status: 'available',
      featured: false,
      description: 'Comfortable and fuel-efficient sedan.',
    },
    {
      vin: '1G1AL5E10D7999999',
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      type: 'Truck',
      color: 'Black',
      mileage: 5000,
      price: '45000.00',
      image_main: 'ford-f150.jpg',
      status: 'available',
      featured: true,
      description: 'The best-selling truck in America.',
    },
  ];

  for (const v of vehicles) {
    await db.insert(schema.vehicle).values(v).onConflictDoNothing();
  }

  console.log('Vehicles seeded!');
  await pool.end();
}

main().catch(console.error);
