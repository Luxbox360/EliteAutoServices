import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const DRIZZLE = 'DRIZZLE';

export const drizzleProvider = [
  {
    provide: DRIZZLE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL');
      
      const isProduction = process.env.NODE_ENV === 'production' || connectionString?.includes('railway.app');

      const pool = new Pool({
        connectionString,
        ...(isProduction && { ssl: { rejectUnauthorized: false } }),
      });
      return drizzle(pool, { schema });
    },
  },
];
