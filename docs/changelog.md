# Changelog - Elite Auto Services (EAS)

## [2026-03-13] - Major Refactor & Feature Expansion

### Added
- **Authentication System:** Implemented JWT-based security for administrative access.
- **Drizzle ORM:** Replaced Prisma with Drizzle ORM for better performance and flexibility.
- **Admin Dashboard (CMS):**
    - Inventory management (Create, Read, Update, Delete vehicles).
    - Lead management (Review and update contact inquiries).
    - Real-time search/filtering in inventory list.
    - Pagination (10 items per page).
    - Image upload zone with live preview in vehicle form.
- **Public Portal Enhancements:**
    - Dedicated Contact Page.
    - Vehicle-specific inquiry system (pre-filled messages).
    - Advanced inventory filters (Make, Type, Sorting).
- **Branding:** Added "Elite Auto" page title and custom car emoji favicon.
- **Documentation:** Created comprehensive `/docs` folder covering API, Database, Architecture, and more.

### Changed
- **Database Schema:** Updated for the USA market. Added `vin` (unique), `title_status`, `transmission`, and `engine` fields.
- **UI/UX Design:**
    - Redesigned Header with high-contrast aesthetic and improved admin navigation.
    - Redesigned Login Page with "Identity Verification" theme.
    - Enhanced Admin Dashboard with status badges and pulsing live indicators.
- **Navigation:** Moved Dashboard link to the right of Contact for better flow.
- **Data Integrity:** Updated all existing vehicle records with unique random 17-character VINs.

### Fixed
- **Mobile Responsiveness:** Improved layout for smartphones and tablets.
- **Duplicated Footer:** Resolved redundant footer rendering on the About page.
- **Spanish Text:** Translated remaining Spanish loading and error messages to English.
- **Search Filter:** Fixed logic issue where admin search was not correctly filtering results.
