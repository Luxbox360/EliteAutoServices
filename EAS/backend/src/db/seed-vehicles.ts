import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool, { schema });

  console.log('Seeding massive inventory...');

  const vehicleData = [
    { name: 'Colorado', make: 'Chevrolet', type: 'Truck', img: 'chevy-colorado.jpg' },
    { name: 'Equinox', make: 'Chevrolet', type: 'SUV', img: 'chevy-equinox.jpg' },
    { name: 'Silverado', make: 'Chevrolet', type: 'Truck', img: 'chevy-silverado.jpg' },
    { name: 'Escape', make: 'Ford', type: 'SUV', img: 'ford-escape.jpg' },
    { name: 'F-150', make: 'Ford', type: 'Truck', img: 'ford-f150.jpg' },
    { name: 'F-250', make: 'Ford', type: 'Truck', img: 'ford-f250.jpg' },
    { name: 'Sierra', make: 'GMC', type: 'Truck', img: 'gmc-sierra.jpg' },
    { name: 'Accord', make: 'Honda', type: 'Sedan', img: 'honda-accord.jpg' },
    { name: 'Civic', make: 'Honda', type: 'Sedan', img: 'honda-civic.jpg' },
    { name: 'CR-V', make: 'Honda', type: 'SUV', img: 'honda-crv.jpg' },
    { name: 'Sonata', make: 'Hyundai', type: 'Sedan', img: 'hyundai-sonata.jpg' },
    { name: 'Tucson', make: 'Hyundai', type: 'SUV', img: 'hyundai-tucson.jpg' },
    { name: 'Grand Cherokee', make: 'Jeep', type: 'SUV', img: 'jeep-grand-cherokee.jpg' },
    { name: 'K5', make: 'Kia', type: 'Sedan', img: 'kia-k5.jpg' },
    { name: 'Sportage', make: 'Kia', type: 'SUV', img: 'kia-sportage.jpg' },
    { name: 'CX-5', make: 'Mazda', type: 'SUV', img: 'mazda-cx5.jpg' },
    { name: 'Mazda6', make: 'Mazda', type: 'Sedan', img: 'mazda-mazda6.jpg' },
    { name: 'Altima', make: 'Nissan', type: 'Sedan', img: 'nissan-altima.jpg' },
    { name: 'Frontier', make: 'Nissan', type: 'Truck', img: 'nissan-frontier.jpg' },
    { name: 'Rogue', make: 'Nissan', type: 'SUV', img: 'nissan-rogue.jpg' },
    { name: '1500', make: 'Ram', type: 'Truck', img: 'ram-1500.jpg' },
    { name: '2500', make: 'Ram', type: 'Truck', img: 'ram-2500.jpg' },
    { name: 'Forester', make: 'Subaru', type: 'SUV', img: 'subaru-forester.jpg' },
    { name: 'Legacy', make: 'Subaru', type: 'Sedan', img: 'subaru-legacy.jpg' },
    { name: 'Camry', make: 'Toyota', type: 'Sedan', img: 'toyota-camry.jpg' },
    { name: 'Corolla', make: 'Toyota', type: 'Sedan', img: 'toyota-corolla.jpg' },
    { name: 'RAV4', make: 'Toyota', type: 'SUV', img: 'toyota-rav4.jpg' },
    { name: 'Tacoma', make: 'Toyota', type: 'Truck', img: 'toyota-tacoma.jpg' },
    { name: 'Tundra', make: 'Toyota', type: 'Truck', img: 'toyota-tundra.jpg' },
    { name: 'Passat', make: 'Volkswagen', type: 'Sedan', img: 'volkswagen-passat.jpg' },
  ];

  function generateVIN(idx: number) {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    let vin = '1G1AL5E10D7' + idx.toString().padStart(6, '0');
    return vin;
  }

  for (let i = 0; i < vehicleData.length; i++) {
    const v = vehicleData[i];
    const price = (Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000).toString() + '.00';
    const mileage = Math.floor(Math.random() * (80000 - 5000 + 1)) + 5000;
    const year = 2018 + Math.floor(Math.random() * 6);

    await db.insert(schema.vehicle).values({
      vin: generateVIN(i),
      make: v.make,
      model: v.name,
      year: year,
      type: v.type,
      color: ['Silver', 'White', 'Black', 'Blue', 'Red', 'Gray'][Math.floor(Math.random() * 6)],
      mileage: mileage,
      price: price,
      image_main: v.img,
      status: 'available',
      description: `This ${year} ${v.make} ${v.name} is in excellent condition. Thoroughly inspected and ready for a new owner. Excellent value for its class.`,
      transmission: 'Automatic',
      engine: 'Standard Configuration',
      title_status: 'Clean',
      specs: {
        condition: 'Excellent',
        warranty: '12 Months',
        features: ['Fully Inspected', 'Clean Title', 'Power Windows', 'Backup Camera', 'Bluetooth']
      }
    }).onConflictDoNothing();
  }

  console.log(`${vehicleData.length} vehicles seeded!`);
  await pool.end();
}

main().catch(console.error);
