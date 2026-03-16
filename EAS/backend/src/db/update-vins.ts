import { Pool } from 'pg';
import 'dotenv/config';

function generateRandomVIN() {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return vin;
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('Generating random VINs for all vehicles...');

  try {
    const res = await pool.query<{ id: number }>('SELECT id FROM vehicle');
    const vehicles = res.rows;

    for (const vehicle of vehicles) {
      const randomVIN = generateRandomVIN();
      await pool.query('UPDATE vehicle SET vin = $1 WHERE id = $2', [
        randomVIN,
        vehicle.id,
      ]);
      console.log(`Updated Vehicle ID ${vehicle.id} with VIN: ${randomVIN}`);
    }

    console.log('All vehicles updated successfully.');
  } catch (err) {
    console.error('Update error:', err);
  }

  await pool.end();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
