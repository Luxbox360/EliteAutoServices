import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  text,
  jsonb,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 20 }).unique().notNull(),
  password: varchar('password', { length: 100 }).notNull(),
  first_name: varchar('first_name', { length: 30 }).notNull(),
  last_name: varchar('last_name', { length: 30 }).notNull(),
  status: varchar('status', { length: 1 }).default('A').notNull(),
  created_at: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const vehicle = pgTable(
  'vehicle',
  {
    id: serial('id').primaryKey(),
    vin: varchar('vin', { length: 17 }).unique().notNull(),
    title: varchar('title', { length: 100 }).default('').notNull(),
    make: varchar('make', { length: 50 }).notNull(),
    model: varchar('model', { length: 50 }).notNull(),
    year: integer('year').notNull(),
    type: varchar('type', { length: 30 }).notNull(),
    color: varchar('color', { length: 30 }).notNull(),
    mileage: integer('mileage').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    title_status: varchar('title_status', { length: 50 })
      .default('Clean')
      .notNull(),
    transmission: varchar('transmission', { length: 50 }),
    engine: varchar('engine', { length: 50 }),
    description: text('description'),
    specs: jsonb('specs'),
    image_main: varchar('image_main', { length: 255 }),
    images: jsonb('images'),
    status: varchar('status', { length: 20 }).default('available').notNull(),
    created_at: timestamp('created_at', { mode: 'date' })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      vinIdx: index('idx_vehicle_vin').on(table.vin),
      statusIdx: index('idx_vehicle_status').on(table.status),
      priceIdx: index('idx_vehicle_price').on(table.price),
    };
  },
);

export const contactInquiry = pgTable(
  'contact_inquiry',
  {
    id: serial('id').primaryKey(),
    vehicle_id: integer('vehicle_id').references(() => vehicle.id, {
      onDelete: 'set null',
    }),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    message: text('message').notNull(),
    interest_type: varchar('interest_type', { length: 50 }),
    status: varchar('status', { length: 20 }).default('new').notNull(),
    created_at: timestamp('created_at', { mode: 'date' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      statusIdx: index('idx_contact_status').on(table.status),
    };
  },
);
