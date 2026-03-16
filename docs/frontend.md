# Frontend Documentation - Elite Auto Services (EAS)

## Overview
The EAS frontend is a modern **React 19** application built with **Vite** and styled using **Tailwind CSS**. It follows a minimalist design aesthetic (Black & White) with a focus on responsiveness for the USA market.

## Architecture

### State-Based Routing
The application uses a custom state-based routing system instead of a traditional router library, managed in `App.tsx`.
- **Pages:** `home`, `about`, `vehicles`, `vehicle-detail`, `login`, `admin-dashboard`.
- **Navigation:** Controlled via the `currentPage` state and passed down to the `Header` and other components.

### Authentication
A custom authentication flow is implemented to protect the administrative dashboard.
- **Service:** `LoginPage.tsx` handles interactions with the `/auth/login` backend endpoint.
- **Persistence:** JWT and user data are stored in `localStorage` (`eas_auth`).
- **State:** Managed in `App.tsx` and propagated to protected components.

## Components Structure
- `Header.tsx`: Global navigation with a subtle admin entry point.
- `Hero.tsx`: Public landing page introduction.
- `VehiclesGrid.tsx`: Displays inventory with filtering capabilities.
- `VehicleDetailPage.tsx`: Focused USA-market vehicle details (VIN, Title Status, Mileage).
- `AdminDashboard.tsx`: Centralized CMS for inventory and lead management.

## Styling Guidelines
- **Primary Colors:** Black (#000000) and White (#FFFFFF).
- **Secondary Colors:** Gray shades for borders and subtle backgrounds.
- **Typography:** Sans-serif (standard system fonts via Tailwind `font-sans`).
- **Interactive:** Subtle transitions and hover effects on buttons and links.
