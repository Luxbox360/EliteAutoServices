# API Documentation - Elite Auto Services (EAS)

## Base URL
`http://localhost:3000`

## Authentication
### POST `/auth/login`
Authenticates a user and returns a JWT.
- **Body:** `{ username, password }`
- **Response:** `{ access_token, user: { id, username, ... } }`

## Vehicles (Inventory)
### GET `/vehicles`
Public endpoint to list all available vehicles.
### GET `/vehicles/:id`
Public endpoint to get full details of a specific vehicle.
### POST `/vehicles`
**Protected.** Create a new vehicle.
### PATCH `/vehicles/:id`
**Protected.** Update vehicle details or status.
### DELETE `/vehicles/:id`
**Protected.** Remove a vehicle from inventory.

## Contact Inquiries (Leads)
### POST `/contact-inquiries`
Public endpoint to submit a new lead.
- **Body:** `{ name, email, phone, message, vehicle_id? }`
### GET `/contact-inquiries`
**Protected.** List all received inquiries.
### PATCH `/contact-inquiries/:id`
**Protected.** Update inquiry status (`new`, `contacted`, `closed`).
### DELETE `/contact-inquiries/:id`
**Protected.** Remove an inquiry.

## Administrative Users
### GET `/admin-users`
**Protected.** List administrative accounts.
