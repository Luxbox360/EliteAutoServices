import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('Running manual migration...');

  try {
    // 1. Convert mileage to integer
    await pool.query(
      'ALTER TABLE vehicle ALTER COLUMN mileage TYPE INTEGER USING mileage::integer;',
    );
    console.log('Mileage converted to integer.');

    // 2. Add vin column with temporary default
    await pool.query(
      "ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS vin VARCHAR(17) DEFAULT 'TEMP';",
    );

    // 3. Update existing vin values to be unique
    await pool.query(
      "UPDATE vehicle SET vin = 'VIN' || id WHERE vin = 'TEMP';",
    );

    // 4. Set NOT NULL and UNIQUE
    await pool.query('ALTER TABLE vehicle ALTER COLUMN vin SET NOT NULL;');
    await pool.query(
      'ALTER TABLE vehicle ADD CONSTRAINT vehicle_vin_unique UNIQUE (vin);',
    );
    console.log('VIN column added and populated.');

    // 5. Add other missing columns from schema.ts
    await pool.query(
      "ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS title_status VARCHAR(50) DEFAULT 'Clean' NOT NULL;",
    );
    await pool.query(
      'ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS transmission VARCHAR(50);',
    );
    await pool.query(
      'ALTER TABLE vehicle ADD COLUMN IF NOT EXISTS engine VARCHAR(50);',
    );
    console.log('USA specific columns added.');
  } catch (err) {
    console.error('Migration error:', err);
  }

  await pool.end();
}

main().catch(console.error);
