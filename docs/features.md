# Application Features - Elite Auto Services (EAS)

## Public Features

### 1. State-Based Routing
The application uses a custom state manager in `App.tsx` to handle navigation without full page reloads, providing a smooth single-page application (SPA) experience.
- **Dynamic Headers:** The header updates its active state and appearance based on the current view and auth status.
- **Smooth Scroll:** Navigation automatically scrolls to the top of the new "page".

### 2. Intelligent Inventory
- **Advanced Filtering:** Users can filter vehicles by Make, Type, and Sort them by price or date.
- **Contextual Inquiries:** Clicking "Schedule Test Drive" or "Get More Info" on a vehicle detail page redirects the user to the Contact page with that specific vehicle pre-selected and the message field auto-filled.

### 3. Dedicated Contact Page
- Separate view accessible from the header.
- Captures name, email, phone, and custom messages.
- Directly integrated with the administrative lead management system.

## Administrative Features

### 1. Persistent & Seamless Session
- Admins remain logged in while browsing public sections of the site.
- **Dynamic Header:** Logged-in admins see a "Dashboard" link and a "Logout" action in the primary navigation.
- **Refined Security:** Redesigned "Identity Verification" login portal.

### 2. Advanced Inventory Management
- **Searchable List:** Quick real-time filtering by Make, Model, VIN, or Year using optimized `useMemo` hooks.
- **Pagination:** Automatic pagination (10 items per page) with dedicated navigation controls.
- **Status Control:** Quick-toggle vehicle status (Available/Sold) directly from the list view.
- **Asset Entry:** Refined vehicle form with **Drag-and-Drop / File selection** for images and live previews.

### 3. Lead Management
- Centralized tab to review all incoming inquiries.
- **Status Tracking:** Update leads to `New`, `Contacted`, or `Closed` to manage the sales funnel.

## Design System
- **Esthetic:** High-contrast "Modern Industrial" minimalist design (Black, White, and Grays).
- **Contrasted UI:** Meticulously balanced contrast ratios for high readability.
- **Responsive:** Mobile-first architecture ensuring perfect display on all screen sizes.
- **Identity:** Custom brand elements including car icon favicon and unified typography.
