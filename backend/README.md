# Bookify Backend

Backend foundation for Bookify, a Smart Appointment & Business Management SaaS platform for appointment-based service businesses.

## Phase 1 Scope

- Node.js and Express backend setup
- MongoDB connection through Mongoose
- Core Mongoose models for users, providers, services, working hours, appointments, payments, and reviews
- Health check API
- Centralized error handling

Not included in Phase 1: Stripe, Google Calendar, Cloudinary, Nodemailer, node-cron, GraphQL, or production authentication flows.

## Install Dependencies

```bash
cd backend
npm install
```

## Environment Setup

Create a local `.env` file from the example:

```bash
copy .env.example .env
```

Default values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookify
CLIENT_URL=http://localhost:4200
NODE_ENV=development
```

Make sure MongoDB is running locally before starting the server.

## Run Development Server

```bash
npm run dev
```

For production-style startup:

```bash
npm start
```

## Health Check

```http
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Bookify backend is running",
  "database": "MongoDB"
}
```

Local URL:

```text
http://localhost:5000/api/health
```

## Cloudinary Image Uploads

Add these variables to `.env` before using upload endpoints:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=bookify
MAX_BOOKING_DAYS_AHEAD=60
```

Allowed image types:

- `image/jpeg`
- `image/png`
- `image/webp`

Maximum image size: `5MB`.
Maximum service images per request: `5`.
Maximum total images per service: `10`.

Uploaded image records store:

- `url`
- `publicId`
- `width`
- `height`
- `format`
- `bytes`
- `moderationStatus`

Provider profile images are served through an optimized square Cloudinary delivery URL. Service images are served through optimized Cloudinary delivery URLs with a max display size suitable for service galleries.

New uploads default to `pending_review` so an admin moderation flow can be added later without changing the stored image shape.

### Provider Profile Image

```http
PATCH /api/uploads/provider/profile-image
```

Postman setup:

- Authorization: Bearer token for a provider user
- Body: `form-data`
- Field name: `image`
- Field type: File

### Service Images

```http
POST /api/uploads/services/:serviceId/images
```

Postman setup:

- Authorization: Bearer token for the provider who owns the service
- Body: `form-data`
- Field name: `images`
- Field type: File
- Maximum files per request: `5`
- Maximum total images per service: `10`

### Delete Service Image

```http
DELETE /api/uploads/services/:serviceId/images
```

Postman setup:

- Authorization: Bearer token for the provider who owns the service
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "publicId": "cloudinary/public-id"
}
```

## Working Hours & Availability

### Provider Working Hours

```http
GET /api/working-hours/my
PUT /api/working-hours/my
GET /api/working-hours/provider/:providerId
```

Provider-only update body:

```json
{
  "workingHours": [
    {
      "dayOfWeek": "sunday",
      "startTime": "09:00",
      "endTime": "17:00",
      "isClosed": false,
      "slotIntervalMinutes": 30,
      "breaks": [
        {
          "startTime": "13:00",
          "endTime": "14:00"
        }
      ]
    },
    {
      "dayOfWeek": "friday",
      "isClosed": true
    }
  ]
}
```

Validation rules:

- Times use `HH:mm`.
- `startTime` must be before `endTime`.
- Breaks must be inside working hours.
- Break `startTime` must be before break `endTime`.
- `slotIntervalMinutes` can be `15`, `30`, `45`, or `60`.
- One working hour document is stored per provider per day.

### Availability

```http
GET /api/availability?providerId=...&serviceId=...&date=YYYY-MM-DD
```

Availability is calculated from provider working hours, selected service duration, breaks, and existing appointments with `pending_payment` or `confirmed` status. Cancelled, rejected, and completed appointments do not block slots.

Availability hardening notes:

- Dates are accepted as provider-local `YYYY-MM-DD` values.
- "Today" and current time are calculated with the provider profile timezone.
- Appointment reads still use UTC `Date` ranges derived from the provider-local day until final booking normalization.
- Availability rejects past dates and dates more than `MAX_BOOKING_DAYS_AHEAD` days ahead.
- Overlapping breaks are rejected; adjacent breaks are allowed.
- Public provider working-hours lookup returns `404` for non-existing providers.
- New provider profiles create seven default closed working-hour records idempotently.
- TODO: add MongoDB integration tests for repository/index behavior when the project has a Mongo memory test setup.

## Appointment Management

### Create Appointment

```http
POST /api/appointments
```

Postman setup:

- Authorization: Bearer token for a customer user
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "providerId": "provider-user-id",
  "serviceId": "service-id",
  "date": "2026-07-20",
  "startTime": "09:00",
  "notes": "Optional notes"
}
```

The backend re-checks working hours, breaks, booking window, service ownership, service status, and blocking appointments before creating the appointment.

### List Customer Appointments

```http
GET /api/appointments/my
```

Requires a customer Bearer token.

### List Provider Appointments

```http
GET /api/appointments/provider
GET /api/appointments/provider?status=pending_payment
GET /api/appointments/provider?date=2026-07-20
GET /api/appointments/provider?from=2026-07-01&to=2026-07-31
```

Requires a provider Bearer token.

### Get Appointment By Id

```http
GET /api/appointments/:id
```

Customers and providers can only view appointments they are involved in. Admin users can view appointment details.

### Cancel Appointment

```http
PATCH /api/appointments/:id/cancel
```

Body:

```json
{
  "reason": "Optional cancellation reason"
}
```

Customers can cancel their own appointments. Providers can cancel appointments assigned to them. Completed or already-cancelled appointments cannot be cancelled.

### Reject Appointment

```http
PATCH /api/appointments/:id/reject
```

Provider-only body:

```json
{
  "reason": "Optional rejection reason"
}
```

### Complete Appointment

```http
PATCH /api/appointments/:id/complete
```

Provider-only. The appointment must be `confirmed`, must belong to the provider, and its end time must already have passed.

### Accept Appointment

```http
PATCH /api/appointments/:id/accept
```

This currently returns a clear validation response because payment confirmation is reserved for Phase 6.

### Double Booking Rejection

Appointments with `pending_payment` or `confirmed` status block overlapping provider slots. `cancelled`, `rejected`, and `completed` appointments do not block future booking.

## Current Status

Phase 1 is ready as a backend foundation. The database connection, Express server, health route, centralized error handler, and initial Mongoose data models are in place.

## Database Notes

- Mongoose query filter sanitization and strict query mode are enabled.
- JSON request bodies are limited to 10kb by default.
- Appointment times use `HH:mm` format.
- Provider appointment lookup indexes are prepared for booking flows.
- Active appointment double-booking is blocked at the model validation layer for matching provider, date, and start time.
- Provider profile search indexes are prepared for city and category filters.
- Soft-delete fields are available where business records commonly need to be deactivated instead of removed.

## Next Phases

- Authentication and authorization
- Provider service management APIs
- Customer booking APIs
- Payment integration
- Reviews and dashboard analytics
- REST API expansion and optional GraphQL layer
