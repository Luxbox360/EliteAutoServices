import { Module, Global } from '@nestjs/common';
import { drizzleProvider, DRIZZLE } from './drizzle.provider';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
