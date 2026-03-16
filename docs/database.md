# Database Documentation - Elite Auto Services (EAS)

## Overview
The EAS database is built on **PostgreSQL** and managed using **Drizzle ORM**. It is designed for a single-seller vehicle platform with a focus on USA-market standards.

## Tables

### 1. `admin_users`
Stores administrative user credentials and status.
- `id`: Serial, Primary Key.
- `username`: Varchar(20), Unique.
- `password`: Varchar(100), Bcrypt hashed.
- `first_name`: Varchar(30).
- `last_name`: Varchar(30).
- `status`: Varchar(1), Default 'A' (Active).
- `created_at`: Timestamp.

### 2. `vehicle`
Stores inventory data for vehicles.
- `id`: Serial, Primary Key.
- `vin`: Varchar(17), Unique (Critical for USA).
- `title`: Varchar(100), Auto-generated (Make + Model + Year).
- `make`: Varchar(50).
- `model`: Varchar(50).
- `year`: Integer.
- `type`: Varchar(30) (SUV, Sedan, Truck, etc.).
- `color`: Varchar(30).
- `mileage`: Integer (Numeric for sorting/filtering).
- `price`: Decimal(10,2).
- `title_status`: Varchar(50), Default 'Clean'.
- `transmission`: Varchar(50).
- `engine`: Varchar(50).
- `description`: Text.
- `specs`: JSONB (Flexible specifications).
- `image_main`: Varchar(255).
- `images`: JSONB (Gallery: main and array of strings).
- `status`: Varchar(20), Default 'available' ('available', 'sold', 'reserved').
- `featured`: Boolean, Default false.
- `created_at`: Timestamp.
- `updated_at`: Timestamp.

### 3. `contact_inquiry`
Stores lead information from potential buyers.
- `id`: Serial, Primary Key.
- `vehicle_id`: Integer, Foreign Key (Set Null on delete).
- `name`: Varchar(100).
- `email`: Varchar(100).
- `phone`: Varchar(20).
- `message`: Text.
- `interest_type`: Varchar(50) ('Call', 'WhatsApp', 'Email').
- `status`: Varchar(20), Default 'new'.
- `created_at`: Timestamp.

## Indexes
- `idx_vehicle_vin`: Optimized for VIN searches.
- `idx_vehicle_status`: Optimized for public inventory views.
- `idx_vehicle_price`: Optimized for price filtering.
- `idx_vehicle_featured`: Optimized for landing page queries.
- `idx_contact_status`: Optimized for lead management.
