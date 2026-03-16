import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool, { schema });

  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('carlos123', 10);

  try {
    await db
      .insert(schema.adminUsers)
      .values({
        username: 'carlos',
        password: hashedPassword,
        first_name: 'Carlos',
        last_name: 'Andres',
        status: 'A',
      })
      .onConflictDoUpdate({
        target: schema.adminUsers.username,
        set: {
          password: hashedPassword,
          first_name: 'Carlos',
          last_name: 'Andres',
        },
      });
    console.log('Admin user created/updated: carlos / carlos123');
  } catch (err) {
    console.error('Error seeding user:', err);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
