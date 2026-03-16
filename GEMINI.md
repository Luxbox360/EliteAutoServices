# Elite Auto Services (EAS) - Project Context

Elite Auto Services is a full-stack web application designed for a single-seller automotive sales platform in the USA. It features a high-conversion public portal and a comprehensive administrative CMS.

## 🏗️ Project Architecture

### Backend (`EAS/backend`)
- **Framework:** NestJS (v11)
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Security:** JWT Authentication with Passport.js.
- **Key Modules:**
  - `AuthModule`: Secure login and session management.
  - `VehiclesModule`: Inventory logic with USA market standards (VIN, Title Status).
  - `ContactInquiriesModule`: Customer lead generation and management.
- **Data Features:**
  - Schema-first design in `src/db/schema.ts`.
  - Advanced PostgreSQL usage: JSONB for galleries and unique constraint management.

### Frontend (`EAS/frontend`)
- **Framework:** React (v19) + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Modern Industrial aesthetic).
- **Features:**
  - Custom state-driven SPA routing.
  - Intelligent vehicle inquiry flow.
  - Full-featured Admin Dashboard with real-time filtering and pagination.
  - Drag-and-Drop image management with previews.

## 🚀 Development Progress

### [PHASE 1-4 COMPLETED]
- [x] Prisma to Drizzle migration.
- [x] USA Market schema expansion (VIN, Mileage, Title).
- [x] Admin Authentication (Backend & Frontend).
- [x] Admin Inventory CMS (Full CRUD).
- [x] Admin Lead Management.
- [x] Search, Filters, and Pagination.
- [x] Design Overhaul (Header, Login, Dashboard).
- [x] Mobile Responsiveness verification.

### [NEXT STEPS]
- [ ] Implement real cloud image storage (e.g., AWS S3 or Cloudinary).
- [ ] Add email notifications for new leads.
- [ ] SEO optimization for public vehicle pages.

## 🛠️ Key Commands

### Backend
```bash
cd EAS/backend
npm run start:dev      # Start server
npx drizzle-kit push   # Sync schema
npx tsx src/db/seed.ts # Seed admin user
```

### Frontend
```bash
cd EAS/frontend
npm run dev            # Start UI
```

## 📂 Documentation
Comprehensive documentation is available in the `/docs` directory:
- `changelog.md`: History of all major changes.
- `features.md`: Detailed list of public and admin functions.
- `api.md`: Backend endpoint references.
- `database.md`: Schema and relationship details.
- `admin-guide.md`: User manual for the platform owner.
