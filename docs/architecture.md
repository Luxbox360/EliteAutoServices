# Architecture Documentation - Elite Auto Services (EAS)

## Technology Stack
- **Backend:** NestJS (Node.js framework)
- **Frontend:** React 19 + Vite
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **Authentication:** JWT (JSON Web Tokens) with Passport.js

## Project Structure

### Backend (`/EAS/backend`)
- `src/db/schema.ts`: Single source of truth for the database schema.
- `src/auth/`: Handles security, JWT strategy, and login logic.
- `src/vehicles/`: Core module for inventory management.
- `src/contact-inquiries/`: Lead management logic.
- `src/db/drizzle.module.ts`: Global module for database connectivity.

### Frontend (`/EAS/frontend`)
- `src/App.tsx`: Central hub for state-based routing and auth state.
- `src/components/`:
  - **Public:** `Hero`, `VehiclesGrid`, `VehicleDetailPage`, `Contact`.
  - **Admin:** `AdminDashboard`, `VehicleForm`, `ContactInquiries`, `LoginPage`.

## Navigation & Routing
The application uses a custom **Hash-Based Routing** system managed in `App.tsx`. 
- **Persistence:** Current view and item IDs (like `vehicle-detail/4`) are synchronized with the URL hash. This ensures that refreshing the page or using the browser's back/forward buttons maintains the correct state.
- **Deep Linking:** Specific vehicles can be shared or bookmarked using their unique hash URL.

## Admin UX Enhancements
- **Delete Workflow:** Destructive operations now use a custom React Modal with a "Modern Industrial" design instead of standard browser alerts.
- **Interactive Analytics:** The dashboard's statistical cards (Total, Available, Sold) double as quick-filters for the inventory list.

