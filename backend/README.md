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
