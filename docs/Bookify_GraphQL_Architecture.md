# GraphQL Architecture Document

**Project:** Bookify – Smart Appointment & Business Management Platform
**Document Version:** 1.0
**Date:** June 30, 2026
**Based On:** Bookify SRS v1.0 · Software Analysis v1.0 · System Design v1.0 · Software Architecture v1.0
**Prepared By:** Senior Solution Architecture Team

---

## 1. Why GraphQL Is Suitable for Bookify

Before defining the schema, it is worth establishing the architectural rationale for choosing GraphQL over a conventional REST API, grounded in the specific characteristics of the Bookify domain.

### 1.1 Two Clients with Different Data Shapes

Bookify has two distinct portals — the Provider Portal and the Customer Portal — whose data needs differ substantially for the same underlying entities. The Provider Dashboard needs appointment counts, revenue aggregates, and review summaries from a single screen. The Customer booking screen needs provider profile, service details, available slots, and pricing. In REST, each portal would either receive over-fetched payloads from shared endpoints or require dedicated per-portal endpoints. GraphQL resolves this cleanly: each client queries exactly the fields it needs from the same schema, eliminating over-fetching and under-fetching.

### 1.2 Highly Relational Domain

The Bookify domain is deeply relational: an Appointment references a Customer, a Provider, a Service, and a Payment; a Review references an Appointment, a Customer, and a Provider; a Dashboard query spans Appointments, Payments, and Reviews. In REST, assembling any of these views requires multiple round trips. In GraphQL, a single query can traverse the full object graph — `{ appointment { service { provider { reviews } } payment { status } } }` — without multiple HTTP calls, significantly reducing client-network overhead and simplifying the Angular component data-loading strategy.

### 1.3 Single Endpoint, Unified Contract

The SRS mandates a single API surface (Section 5.5). GraphQL's single endpoint (`POST /graphql`) naturally satisfies this constraint, while schema introspection provides a self-documenting, auto-typed contract between the Angular client and the server. This eliminates the need for a separate API documentation layer and ensures the client is always aware of the full available graph.

### 1.4 Strong Typing and Schema-First Safety

GraphQL's type system, combined with code-generation tooling (e.g., GraphQL Code Generator), produces TypeScript types from the schema for both the Angular client and the Node.js resolver layer. This means a breaking schema change is caught at compile time rather than at runtime, which directly improves the reliability requirements in NFR-03 and NFR-12.

### 1.5 Mutations Model Appointment Lifecycle Precisely

The appointment lifecycle (pending_payment → confirmed → completed / cancelled / no_show) is a command-driven, operation-oriented domain — not a CRUD domain. GraphQL mutations express business operations explicitly (`confirmAppointment`, `cancelAppointment`, `requestReschedule`, `markNoShow`) rather than forcing domain actions into HTTP verbs (`PATCH /appointments/:id` with a status field), which carries no inherent business meaning and is harder to validate and audit.

### 1.6 Resolver-Level Authorization

GraphQL's resolver architecture allows authorization checks to be co-located with data access at the field level. A Provider can query `provider { revenue }` but a Customer resolving that same Provider object sees `null` for restricted fields — enforced in the resolver, not through a proliferation of endpoint variants. This directly supports FR-08 and NFR-06.

---

## 2. Folder Structure

The backend GraphQL layer uses a **domain-first, feature-module** organization. Each domain module owns its type definitions, resolvers, service, and repository, keeping all concerns for a given domain co-located and allowing the module to be reasoned about, tested, or evolved independently.

```
src/
├── main.ts                           # Express + Apollo Server bootstrap
├── app.ts                            # Express app wiring, global middleware
│
├── graphql/
│   ├── schema.ts                     # Merge all typeDefs & resolvers
│   ├── context.ts                    # GraphQL context builder (auth, dataloaders)
│   ├── directives/
│   │   ├── auth.directive.ts         # @auth(role: PROVIDER | CUSTOMER)
│   │   └── deprecated.directive.ts
│   ├── scalars/
│   │   ├── date.scalar.ts            # Custom Date scalar (ISO 8601)
│   │   ├── objectId.scalar.ts        # Custom ObjectId scalar
│   │   └── decimal.scalar.ts         # Custom Decimal128 scalar (prices)
│   └── dataloaders/
│       ├── provider.loader.ts        # Batch-load Providers by ID
│       ├── service.loader.ts         # Batch-load Services by ID
│       ├── customer.loader.ts        # Batch-load Customers by ID
│       └── review.loader.ts          # Batch-load Reviews by providerId
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.typedefs.ts          # User, AuthPayload, LoginInput, RegisterInput
│   │   ├── auth.resolvers.ts         # register, login, verifyEmail, resetPassword
│   │   ├── auth.service.ts           # Business logic: hashing, JWT, token mgmt
│   │   └── auth.repository.ts        # Mongoose queries on users collection
│   │
│   ├── provider/
│   │   ├── provider.typedefs.ts      # Provider, UpdateProviderInput
│   │   ├── provider.resolvers.ts     # provider, providers, updateProvider, ...
│   │   ├── provider.service.ts       # Profile logic, image upload orchestration
│   │   └── provider.repository.ts    # Mongoose queries on providers collection
│   │
│   ├── customer/
│   │   ├── customer.typedefs.ts      # Customer, UpdateCustomerInput
│   │   ├── customer.resolvers.ts     # customer, updateCustomer
│   │   ├── customer.service.ts       # Profile logic
│   │   └── customer.repository.ts    # Mongoose queries on customers collection
│   │
│   ├── service/
│   │   ├── service.typedefs.ts       # Service, CreateServiceInput, UpdateServiceInput
│   │   ├── service.resolvers.ts      # services, service, createService, ...
│   │   ├── service.service.ts        # Validation, activation/deactivation rules
│   │   └── service.repository.ts     # Mongoose queries on services collection
│   │
│   ├── workingHours/
│   │   ├── workinghours.typedefs.ts
│   │   ├── workinghours.resolvers.ts
│   │   ├── workinghours.service.ts   # Slot generation algorithm
│   │   └── workinghours.repository.ts
│   │
│   ├── appointment/
│   │   ├── appointment.typedefs.ts   # Appointment, all input/status types
│   │   ├── appointment.resolvers.ts  # appointment, appointments, requestBooking, ...
│   │   ├── appointment.service.ts    # Core booking, cancel, reschedule logic
│   │   └── appointment.repository.ts # Atomic slot operations, aggregations
│   │
│   ├── payment/
│   │   ├── payment.typedefs.ts       # Payment, Refund types
│   │   ├── payment.resolvers.ts      # initiatePayment, confirmPayment, ...
│   │   ├── payment.service.ts        # Stripe orchestration, refund policy
│   │   └── payment.repository.ts     # Mongoose queries on payments collection
│   │
│   ├── review/
│   │   ├── review.typedefs.ts        # Review, SubmitReviewInput
│   │   ├── review.resolvers.ts       # reviews, submitReview, replyToReview
│   │   ├── review.service.ts         # Eligibility, dedup, rating recalc
│   │   └── review.repository.ts      # Mongoose queries on reviews collection
│   │
│   ├── notification/
│   │   ├── notification.typedefs.ts
│   │   ├── notification.resolvers.ts
│   │   ├── notification.service.ts   # Dispatch orchestration, retry logic
│   │   └── notification.repository.ts
│   │
│   └── dashboard/
│       ├── dashboard.typedefs.ts     # DashboardSummary, DateRangeInput
│       ├── dashboard.resolvers.ts    # providerDashboard
│       └── dashboard.service.ts      # Aggregation across Appt/Payment/Review
│
├── integrations/
│   ├── stripe/
│   │   └── stripe.adapter.ts
│   ├── googleCalendar/
│   │   └── googlecalendar.adapter.ts
│   ├── cloudinary/
│   │   └── cloudinary.adapter.ts
│   └── mail/
│       └── mail.adapter.ts
│
├── scheduler/
│   ├── scheduler.bootstrap.ts
│   └── jobs/
│       ├── reminder.job.ts
│       ├── statusTransition.job.ts
│       └── slotRelease.job.ts
│
├── middleware/
│   ├── authenticate.ts               # JWT verification middleware
│   └── errorHandler.ts               # Centralized error formatting
│
└── config/
    ├── database.ts
    ├── env.ts
    └── constants.ts
```

---

## 3. GraphQL Types

All types, inputs, enums, and scalars are shown in SDL (Schema Definition Language).

```graphql
# ─────────────────────────────────────────────
# SCALARS
# ─────────────────────────────────────────────

scalar Date       # ISO 8601 date-time string
scalar ObjectID   # MongoDB ObjectId as opaque string
scalar Decimal    # Monetary values — Decimal128

# ─────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────

enum Role {
  PROVIDER
  CUSTOMER
}

enum AppointmentStatus {
  PENDING_PAYMENT
  CONFIRMED
  COMPLETED
  CANCELLED_BY_CUSTOMER
  CANCELLED_BY_PROVIDER
  NO_SHOW
}

enum PaymentStatus {
  PENDING
  SUCCEEDED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum NotificationType {
  BOOKING_CONFIRMATION
  NEW_BOOKING_ALERT
  REMINDER
  CANCELLATION
  RESCHEDULE
  REVIEW_REQUEST
  PASSWORD_RESET
  EMAIL_VERIFICATION
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
}

enum SortOrder {
  ASC
  DESC
}

# ─────────────────────────────────────────────
# CORE TYPES
# ─────────────────────────────────────────────

type User {
  id:              ObjectID!
  email:           String!
  role:            Role!
  isEmailVerified: Boolean!
  status:          String!
  createdAt:       Date!
}

type Customer {
  id:              ObjectID!
  user:            User!
  fullName:        String!
  phone:           String
  profileImageUrl: String
  appointments:    [Appointment!]!
  reviews:         [Review!]!
  createdAt:       Date!
}

type Provider {
  id:                        ObjectID!
  user:                      User!
  businessName:              String!
  category:                  String!
  description:               String
  address:                   Address!
  phone:                     String
  profileImageUrl:           String
  galleryImageUrls:          [String!]!
  cancellationCutoffHours:   Int!
  minBookingLeadTimeHours:   Int!
  maxBookingAdvanceDays:     Int!
  bufferTimeMinutes:         Int!
  averageRating:             Float!
  reviewCount:               Int!
  isGoogleCalendarConnected: Boolean!
  services:                  [Service!]!
  workingHours:              WorkingHours
  reviews:                   [Review!]!
  createdAt:                 Date!
}

type Address {
  street:     String
  city:       String!
  state:      String
  country:    String!
  postalCode: String
}

type Service {
  id:              ObjectID!
  provider:        Provider!
  name:            String!
  description:     String
  price:           Decimal!
  currency:        String!
  durationMinutes: Int!
  category:        String!
  imageUrl:        String
  isActive:        Boolean!
  createdAt:       Date!
}

type WorkingHours {
  id:             ObjectID!
  provider:       Provider!
  weeklySchedule: [ScheduleEntry!]!
  exceptions:     [ScheduleException!]!
  timezone:       String!
}

type ScheduleEntry {
  dayOfWeek: Int!      # 0 = Sunday … 6 = Saturday
  isWorking: Boolean!
  startTime: String    # "HH:MM"
  endTime:   String
}

type ScheduleException {
  date:               Date!
  isFullyUnavailable: Boolean!
  startTime:          String
  endTime:            String
  reason:             String
}

type Slot {
  startTime: Date!
  endTime:   Date!
}

type Appointment {
  id:                    ObjectID!
  customer:              Customer!
  provider:              Provider!
  service:               Service!
  serviceSnapshot:       ServiceSnapshot!
  startTime:             Date!
  endTime:               Date!
  status:                AppointmentStatus!
  reservationExpiresAt:  Date
  payment:               Payment
  review:                Review
  cancellation:          CancellationDetail
  googleCalendarEventId: String
  createdAt:             Date!
  updatedAt:             Date!
}

type ServiceSnapshot {
  name:            String!
  price:           Decimal!
  currency:        String!
  durationMinutes: Int!
}

type CancellationDetail {
  cancelledBy:  Role!
  cancelledAt:  Date!
  reason:       String
  refundIssued: Boolean!
}

type Payment {
  id:                    ObjectID!
  appointment:           Appointment!
  customer:              Customer!
  amount:                Decimal!
  currency:              String!
  stripePaymentIntentId: String!
  status:                PaymentStatus!
  refund:                RefundDetail
  createdAt:             Date!
  updatedAt:             Date!
}

type RefundDetail {
  stripeRefundId: String!
  amount:         Decimal!
  reason:         String
  processedAt:    Date!
}

type Review {
  id:            ObjectID!
  appointment:   Appointment!
  customer:      Customer!
  provider:      Provider!
  rating:        Int!
  comment:       String
  providerReply: ProviderReply
  createdAt:     Date!
}

type ProviderReply {
  text:      String!
  repliedAt: Date!
}

type Notification {
  id:          ObjectID!
  recipient:   User!
  appointment: Appointment
  type:        NotificationType!
  channel:     String!
  status:      NotificationStatus!
  sentAt:      Date
  createdAt:   Date!
}

type AuthPayload {
  token:  String!
  role:   Role!
  userId: ObjectID!
}

type DashboardSummary {
  totalAppointments:     Int!
  confirmedAppointments: Int!
  completedAppointments: Int!
  cancelledAppointments: Int!
  noShowAppointments:    Int!
  upcomingAppointments:  [Appointment!]!
  totalRevenue:          Decimal!
  averageRating:         Float!
  reviewCount:           Int!
}

type SlotAvailability {
  serviceId:  ObjectID!
  providerId: ObjectID!
  date:       Date!
  slots:      [Slot!]!
}

type OperationResult {
  success: Boolean!
  message: String
}
```

---

## 4. Input Types

```graphql
# ─────────────────────────────────────────────
# AUTH INPUTS
# ─────────────────────────────────────────────

input RegisterInput {
  email:           String!
  password:        String!
  confirmPassword: String!
  role:            Role!
}

input LoginInput {
  email:    String!
  password: String!
}

input ResetPasswordInput {
  token:           String!
  newPassword:     String!
  confirmPassword: String!
}

# ─────────────────────────────────────────────
# PROFILE INPUTS
# ─────────────────────────────────────────────

input UpdateCustomerInput {
  fullName:        String
  phone:           String
  profileImageUrl: String
}

input UpdateProviderInput {
  businessName:            String
  category:                String
  description:             String
  address:                 AddressInput
  phone:                   String
  profileImageUrl:         String
  galleryImageUrls:        [String!]
  cancellationCutoffHours: Int
  minBookingLeadTimeHours: Int
  maxBookingAdvanceDays:   Int
  bufferTimeMinutes:       Int
}

input AddressInput {
  street:     String
  city:       String!
  state:      String
  country:    String!
  postalCode: String
}

# ─────────────────────────────────────────────
# SERVICE INPUTS
# ─────────────────────────────────────────────

input CreateServiceInput {
  name:            String!
  description:     String
  price:           Decimal!
  currency:        String!
  durationMinutes: Int!
  category:        String!
  imageUrl:        String
}

input UpdateServiceInput {
  name:            String
  description:     String
  price:           Decimal
  currency:        String
  durationMinutes: Int
  category:        String
  imageUrl:        String
}

# ─────────────────────────────────────────────
# WORKING HOURS INPUTS
# ─────────────────────────────────────────────

input SetWorkingHoursInput {
  weeklySchedule: [ScheduleEntryInput!]!
  timezone:       String!
}

input ScheduleEntryInput {
  dayOfWeek: Int!
  isWorking: Boolean!
  startTime: String
  endTime:   String
}

input AddScheduleExceptionInput {
  date:               Date!
  isFullyUnavailable: Boolean!
  startTime:          String
  endTime:            String
  reason:             String
}

# ─────────────────────────────────────────────
# APPOINTMENT INPUTS
# ─────────────────────────────────────────────

input RequestBookingInput {
  serviceId:  ObjectID!
  providerId: ObjectID!
  startTime:  Date!
}

input CancelAppointmentInput {
  appointmentId: ObjectID!
  reason:        String
}

input RescheduleAppointmentInput {
  appointmentId: ObjectID!
  newStartTime:  Date!
}

# ─────────────────────────────────────────────
# PAYMENT INPUTS
# ─────────────────────────────────────────────

input InitiatePaymentInput {
  appointmentId: ObjectID!
}

input ConfirmPaymentInput {
  paymentIntentId: String!
}

input HandlePaymentFailureInput {
  paymentIntentId: String!
  reason:          String!
}

# ─────────────────────────────────────────────
# REVIEW INPUTS
# ─────────────────────────────────────────────

input SubmitReviewInput {
  appointmentId: ObjectID!
  rating:        Int!   # 1–5, enforced in service layer
  comment:       String
}

input ReplyToReviewInput {
  reviewId: ObjectID!
  text:     String!
}

# ─────────────────────────────────────────────
# FILTER / PAGINATION INPUTS
# ─────────────────────────────────────────────

input DateRangeInput {
  from: Date!
  to:   Date!
}

input ProviderFilterInput {
  category:   String
  city:       String
  searchTerm: String
}

input AppointmentFilterInput {
  status:    AppointmentStatus
  dateRange: DateRangeInput
}

input PaginationInput {
  page:  Int!   # 1-based
  limit: Int!   # max 50
}
```

---

## 5. Queries

```graphql
type Query {

  # ── AUTH / SESSION ───────────────────────────────────────────────────
  # Returns the currently authenticated user's base identity.
  me: User!                                              # @auth(role: ANY)


  # ── PROVIDER ─────────────────────────────────────────────────────────
  # Fetch a single provider's public profile by ID.
  provider(id: ObjectID!): Provider

  # Browse/search providers with optional filters and pagination.
  providers(
    filter:     ProviderFilterInput
    pagination: PaginationInput
  ): [Provider!]!

  # Returns the authenticated provider's own full profile.
  myProviderProfile: Provider!                           # @auth(role: PROVIDER)


  # ── CUSTOMER ─────────────────────────────────────────────────────────
  # Returns the authenticated customer's own profile.
  myCustomerProfile: Customer!                           # @auth(role: CUSTOMER)


  # ── SERVICES ─────────────────────────────────────────────────────────
  # Fetch all active services offered by a provider.
  servicesByProvider(providerId: ObjectID!): [Service!]!

  # Fetch a single service by ID.
  service(id: ObjectID!): Service


  # ── AVAILABILITY ─────────────────────────────────────────────────────
  # Returns available bookable slots for a given service/provider/date.
  # Applies working hours, exceptions, buffer time, lead time, and
  # existing bookings to compute the real-time open slot list.
  availableSlots(
    providerId: ObjectID!
    serviceId:  ObjectID!
    date:       Date!
  ): SlotAvailability!                                   # @auth(role: CUSTOMER)


  # ── APPOINTMENTS ─────────────────────────────────────────────────────
  # Fetch a single appointment. Accessible only by the owning customer or provider.
  appointment(id: ObjectID!): Appointment!               # @auth(role: ANY)

  # Customer: their own history. Provider: their incoming/past appointments.
  myAppointments(
    filter:     AppointmentFilterInput
    pagination: PaginationInput
  ): [Appointment!]!                                     # @auth(role: ANY)


  # ── PAYMENTS ─────────────────────────────────────────────────────────
  # Fetch payment detail for a specific appointment.
  paymentByAppointment(
    appointmentId: ObjectID!
  ): Payment!                                            # @auth(role: ANY)


  # ── REVIEWS ──────────────────────────────────────────────────────────
  # All reviews for a provider's public profile.
  reviewsByProvider(
    providerId: ObjectID!
    pagination: PaginationInput
  ): [Review!]!

  # Reviews authored by the authenticated customer.
  myReviews: [Review!]!                                  # @auth(role: CUSTOMER)


  # ── DASHBOARD ────────────────────────────────────────────────────────
  # Aggregated performance dashboard for the authenticated provider.
  providerDashboard(
    dateRange: DateRangeInput
  ): DashboardSummary!                                   # @auth(role: PROVIDER)

  # Working hours configuration for the authenticated provider.
  myWorkingHours: WorkingHours!                          # @auth(role: PROVIDER)
}
```

---

## 6. Mutations

```graphql
type Mutation {

  # ── AUTH ─────────────────────────────────────────────────────────────
  registerUser(input: RegisterInput!): OperationResult!
  login(input: LoginInput!): AuthPayload!
  verifyEmail(token: String!): OperationResult!
  requestPasswordReset(email: String!): OperationResult!
  resetPassword(input: ResetPasswordInput!): OperationResult!
  deactivateAccount: OperationResult!                    # @auth(role: ANY)


  # ── PROVIDER PROFILE ─────────────────────────────────────────────────
  updateProviderProfile(
    input: UpdateProviderInput!
  ): Provider!                                           # @auth(role: PROVIDER)


  # ── CUSTOMER PROFILE ─────────────────────────────────────────────────
  updateCustomerProfile(
    input: UpdateCustomerInput!
  ): Customer!                                           # @auth(role: CUSTOMER)


  # ── SERVICES ─────────────────────────────────────────────────────────
  createService(input: CreateServiceInput!): Service!    # @auth(role: PROVIDER)

  updateService(
    id:    ObjectID!
    input: UpdateServiceInput!
  ): Service!                                            # @auth(role: PROVIDER)

  # Soft-delete — blocked if service has active future appointments (BR-07).
  deactivateService(id: ObjectID!): OperationResult!     # @auth(role: PROVIDER)


  # ── WORKING HOURS ────────────────────────────────────────────────────
  setWorkingHours(input: SetWorkingHoursInput!): WorkingHours!     # @auth(role: PROVIDER)
  addScheduleException(input: AddScheduleExceptionInput!): WorkingHours!  # @auth(role: PROVIDER)
  removeScheduleException(date: Date!): WorkingHours!              # @auth(role: PROVIDER)


  # ── APPOINTMENTS ─────────────────────────────────────────────────────
  # Atomically reserves a slot; returns appointment with reservationExpiresAt.
  requestBooking(input: RequestBookingInput!): Appointment!    # @auth(role: CUSTOMER)

  # Customer cancellation — refund eligibility evaluated via BR-03.
  cancelAppointment(input: CancelAppointmentInput!): Appointment!  # @auth(role: CUSTOMER)

  # Provider cancellation — always triggers full refund (BR-04).
  cancelAppointmentByProvider(
    input: CancelAppointmentInput!
  ): Appointment!                                        # @auth(role: PROVIDER)

  # Customer reschedule to a new available slot.
  rescheduleAppointment(
    input: RescheduleAppointmentInput!
  ): Appointment!                                        # @auth(role: CUSTOMER)

  markAppointmentCompleted(id: ObjectID!): Appointment!  # @auth(role: PROVIDER)
  markAppointmentNoShow(id: ObjectID!): Appointment!     # @auth(role: PROVIDER)


  # ── PAYMENTS ─────────────────────────────────────────────────────────
  # Creates Stripe PaymentIntent; returns clientSecret for Stripe.js.
  initiatePayment(input: InitiatePaymentInput!): Payment!    # @auth(role: CUSTOMER)

  # Called after Stripe.js confirms payment client-side.
  confirmPayment(input: ConfirmPaymentInput!): Appointment!  # @auth(role: CUSTOMER)

  # Called after Stripe.js reports failure client-side.
  handlePaymentFailure(
    input: HandlePaymentFailureInput!
  ): OperationResult!                                    # @auth(role: CUSTOMER)


  # ── REVIEWS ──────────────────────────────────────────────────────────
  # One review per completed appointment; enforced in service (FR-44, BR-05).
  submitReview(input: SubmitReviewInput!): Review!        # @auth(role: CUSTOMER)

  # Single public reply per review.
  replyToReview(input: ReplyToReviewInput!): Review!      # @auth(role: PROVIDER)


  # ── GOOGLE CALENDAR ──────────────────────────────────────────────────
  connectGoogleCalendar(authCode: String!): OperationResult!    # @auth(role: PROVIDER)
  disconnectGoogleCalendar: OperationResult!                    # @auth(role: PROVIDER)
}
```

---

## 7. Relationships Between Types

The table maps each GraphQL type's object-type fields, cardinality, and resolution strategy (DataLoader vs. direct repository call). DataLoader is used wherever an object-type field could trigger N+1 queries across a list result.

| Parent Type     | Field               | Child Type      | Cardinality | Resolution Strategy              |
|-----------------|---------------------|-----------------|-------------|----------------------------------|
| `Customer`      | `user`              | `User`          | 1:1         | DataLoader — user.loader         |
| `Customer`      | `appointments`      | `[Appointment]` | 1:N         | Repository.findByCustomerId      |
| `Customer`      | `reviews`           | `[Review]`      | 1:N         | Repository.findByCustomerId      |
| `Provider`      | `user`              | `User`          | 1:1         | DataLoader — user.loader         |
| `Provider`      | `services`          | `[Service]`     | 1:N         | DataLoader — service.loader      |
| `Provider`      | `workingHours`      | `WorkingHours`  | 1:1         | Repository.findByProviderId      |
| `Provider`      | `reviews`           | `[Review]`      | 1:N         | DataLoader — review.loader       |
| `Service`       | `provider`          | `Provider`      | N:1         | DataLoader — provider.loader     |
| `Appointment`   | `customer`          | `Customer`      | N:1         | DataLoader — customer.loader     |
| `Appointment`   | `provider`          | `Provider`      | N:1         | DataLoader — provider.loader     |
| `Appointment`   | `service`           | `Service`       | N:1         | DataLoader — service.loader      |
| `Appointment`   | `payment`           | `Payment`       | 1:1         | Repository.findByAppointmentId   |
| `Appointment`   | `review`            | `Review`        | 1:0..1      | Repository.findByAppointmentId   |
| `Payment`       | `appointment`       | `Appointment`   | 1:1         | Repository.findById              |
| `Payment`       | `customer`          | `Customer`      | N:1         | DataLoader — customer.loader     |
| `Review`        | `appointment`       | `Appointment`   | 1:1         | Repository.findById              |
| `Review`        | `customer`          | `Customer`      | N:1         | DataLoader — customer.loader     |
| `Review`        | `provider`          | `Provider`      | N:1         | DataLoader — provider.loader     |
| `Notification`  | `recipient`         | `User`          | N:1         | DataLoader — user.loader         |
| `Notification`  | `appointment`       | `Appointment`   | N:1         | DataLoader — appointment.loader  |
| `WorkingHours`  | `provider`          | `Provider`      | 1:1         | Repository.findById              |

---

## 8. Resolvers

Resolvers are thin adapters between the GraphQL layer and the Service layer. Each resolver authenticates the request from context, delegates immediately to a service method, and returns the result. Zero business logic lives in a resolver.

```
# ── auth.resolvers ──────────────────────────────────────────────────────────
Query:
  me                        → authService.getCurrentUser(context.userId)

Mutation:
  registerUser              → authService.register(input)
  login                     → authService.login(input)
  verifyEmail               → authService.verifyEmail(token)
  requestPasswordReset      → authService.requestPasswordReset(email)
  resetPassword             → authService.resetPassword(input)
  deactivateAccount         → authService.deactivateAccount(context.userId)


# ── provider.resolvers ──────────────────────────────────────────────────────
Query:
  provider                  → providerService.getById(id)
  providers                 → providerService.search(filter, pagination)
  myProviderProfile         → providerService.getByUserId(context.userId)

Mutation:
  updateProviderProfile     → providerService.update(context.userId, input)
  connectGoogleCalendar     → providerService.connectCalendar(context.userId, authCode)
  disconnectGoogleCalendar  → providerService.disconnectCalendar(context.userId)

Type.Provider field resolvers:
  user                      → context.loaders.user.load(parent.userId)
  services                  → context.loaders.service.loadMany(parent._id)
  workingHours              → workingHoursService.getByProviderId(parent._id)
  reviews                   → context.loaders.review.load(parent._id)


# ── customer.resolvers ──────────────────────────────────────────────────────
Query:
  myCustomerProfile         → customerService.getByUserId(context.userId)

Mutation:
  updateCustomerProfile     → customerService.update(context.userId, input)

Type.Customer field resolvers:
  user                      → context.loaders.user.load(parent.userId)
  appointments              → appointmentService.getByCustomerId(parent._id)
  reviews                   → reviewService.getByCustomerId(parent._id)


# ── service.resolvers ───────────────────────────────────────────────────────
Query:
  servicesByProvider        → serviceService.getActiveByProvider(providerId)
  service                   → serviceService.getById(id)

Mutation:
  createService             → serviceService.create(context.userId, input)
  updateService             → serviceService.update(context.userId, id, input)
  deactivateService         → serviceService.deactivate(context.userId, id)

Type.Service field resolvers:
  provider                  → context.loaders.provider.load(parent.providerId)


# ── workingHours.resolvers ──────────────────────────────────────────────────
Query:
  myWorkingHours            → workingHoursService.getByProviderId(context.providerId)
  availableSlots            → workingHoursService.generateSlots(providerId, serviceId, date)

Mutation:
  setWorkingHours           → workingHoursService.set(context.userId, input)
  addScheduleException      → workingHoursService.addException(context.userId, input)
  removeScheduleException   → workingHoursService.removeException(context.userId, date)


# ── appointment.resolvers ───────────────────────────────────────────────────
Query:
  appointment               → appointmentService.getById(id, context)
  myAppointments            → appointmentService.getForCurrentUser(context, filter, pagination)

Mutation:
  requestBooking            → appointmentService.reserveSlot(context.userId, input)
  cancelAppointment         → appointmentService.cancelByCustomer(context.userId, input)
  cancelAppointmentByProvider → appointmentService.cancelByProvider(context.userId, input)
  rescheduleAppointment     → appointmentService.reschedule(context.userId, input)
  markAppointmentCompleted  → appointmentService.markCompleted(context.userId, id)
  markAppointmentNoShow     → appointmentService.markNoShow(context.userId, id)

Type.Appointment field resolvers:
  customer                  → context.loaders.customer.load(parent.customerId)
  provider                  → context.loaders.provider.load(parent.providerId)
  service                   → context.loaders.service.load(parent.serviceId)
  payment                   → paymentService.getByAppointmentId(parent._id)
  review                    → reviewService.getByAppointmentId(parent._id)


# ── payment.resolvers ───────────────────────────────────────────────────────
Query:
  paymentByAppointment      → paymentService.getByAppointmentId(appointmentId)

Mutation:
  initiatePayment           → paymentService.createIntent(context.userId, input)
  confirmPayment            → paymentService.confirmSuccess(context.userId, input)
  handlePaymentFailure      → paymentService.handleFailure(context.userId, input)

Type.Payment field resolvers:
  appointment               → appointmentService.getById(parent.appointmentId)
  customer                  → context.loaders.customer.load(parent.customerId)


# ── review.resolvers ────────────────────────────────────────────────────────
Query:
  reviewsByProvider         → reviewService.getByProviderId(providerId, pagination)
  myReviews                 → reviewService.getByCustomerId(context.userId)

Mutation:
  submitReview              → reviewService.submit(context.userId, input)
  replyToReview             → reviewService.addReply(context.userId, input)

Type.Review field resolvers:
  appointment               → appointmentService.getById(parent.appointmentId)
  customer                  → context.loaders.customer.load(parent.customerId)
  provider                  → context.loaders.provider.load(parent.providerId)


# ── dashboard.resolvers ─────────────────────────────────────────────────────
Query:
  providerDashboard         → dashboardService.getSummary(context.userId, dateRange)
```

---

## 9. Service Layer

Each service encapsulates domain logic and orchestrates Repositories and Integration adapters. Services never call each other's repositories — only each other's public service interfaces when cross-domain logic is required.

```
AuthService
  register(input)
    → Validate email uniqueness — UserRepository.findByEmail
    → Hash password — bcrypt
    → Persist user — UserRepository.insert
    → Create role profile — CustomerRepository.insert | ProviderRepository.insert
    → Generate verification token, set expiry — UserRepository.update
    → Dispatch verification email — MailAdapter.send

  login(input)
    → Find user — UserRepository.findByEmail
    → Compare password hash — bcrypt.compare
    → Assert isEmailVerified, status = active
    → Sign and return JWT

  verifyEmail(token)
    → Find user by token + expiry — UserRepository.findByVerificationToken
    → Set isEmailVerified = true, clear token — UserRepository.update

  requestPasswordReset(email)
    → Find user — UserRepository.findByEmail
    → Generate reset token + expiry — UserRepository.setResetToken
    → Dispatch reset email — MailAdapter.send

  resetPassword(input)
    → Validate token + expiry — UserRepository.findByResetToken
    → Hash new password — UserRepository.setPasswordHash
    → Clear reset token — UserRepository.clearResetToken


ProviderService
  getById(id)             → ProviderRepository.findById
  getByUserId(userId)     → ProviderRepository.findByUserId
  search(filter, page)    → ProviderRepository.search
  update(userId, input)
    → Resolve providerId — ProviderRepository.findByUserId
    → Upload images if present — CloudinaryAdapter.upload
    → ProviderRepository.update
  connectCalendar(userId, authCode)
    → GoogleCalendarAdapter.exchangeAuthCode
    → ProviderRepository.updateCalendarTokens
  disconnectCalendar(userId)
    → ProviderRepository.clearCalendarTokens


ServiceService
  create(userId, input)
    → Resolve providerId — ProviderRepository.findByUserId
    → Validate price > 0, duration > 0
    → ServiceRepository.insert
  update(userId, id, input)
    → Assert provider ownership — ServiceRepository.findById
    → ServiceRepository.update
  deactivate(userId, id)
    → Assert ownership
    → AppointmentRepository.countFutureConfirmed(serviceId) — must be 0 (BR-07)
    → ServiceRepository.setActive(id, false)


WorkingHoursService
  set(userId, input)
    → Resolve providerId
    → Validate no overlapping day entries
    → WorkingHoursRepository.upsertByProvider
  addException(userId, input)
    → Resolve providerId
    → Warn if existing confirmed appointments affected (not auto-cancelled)
    → WorkingHoursRepository.pushException
  removeException(userId, date)   → WorkingHoursRepository.pullException
  generateSlots(providerId, serviceId, date)
    → Fetch WorkingHours — WorkingHoursRepository.findByProviderId
    → Fetch service duration — ServiceRepository.findById
    → Fetch existing bookings for date — AppointmentRepository.findByProviderId
    → Apply exceptions, buffer, lead time, advance window (BR-06, BR-08, BR-10, FR-18)
    → Return computed Slot[]


AppointmentService
  reserveSlot(userId, input)
    → Resolve customerId
    → Assert service isActive, slot within working hours — WorkingHoursService.generateSlots
    → AppointmentRepository.atomicInsert (findOneAndUpdate on compound slot index — NFR-08)
    → Set reservationExpiresAt = now + 10 min
    → Return Appointment (status: PENDING_PAYMENT)

  cancelByCustomer(userId, input)
    → Assert customerId ownership, status = CONFIRMED
    → Evaluate cutoff — ProviderRepository.findById → cancellationCutoffHours (BR-03)
    → AppointmentRepository.updateStatus(CANCELLED_BY_CUSTOMER)
    → PaymentService.issueRefundIfEligible(paymentId, eligible)
    → NotificationService.sendCancellationNotice(appointmentId, CUSTOMER)
    → GoogleCalendarAdapter.deleteEvent(googleCalendarEventId)

  cancelByProvider(userId, input)
    → Assert providerId ownership
    → AppointmentRepository.updateStatus(CANCELLED_BY_PROVIDER)
    → PaymentService.issueFullRefund(paymentId)   ← always (BR-04)
    → NotificationService.sendCancellationNotice(appointmentId, PROVIDER)
    → GoogleCalendarAdapter.deleteEvent(...)

  reschedule(userId, input)
    → Assert customerId ownership, status = CONFIRMED
    → WorkingHoursService.generateSlots → assert newStartTime in available list
    → AppointmentRepository.atomicReschedule (release old slot, lock new slot atomically)
    → NotificationService.sendRescheduleNotice(appointmentId)
    → GoogleCalendarAdapter.updateEvent(...)

  markCompleted(userId, id)   → Assert providerId ownership → updateStatus(COMPLETED)
  markNoShow(userId, id)      → Assert providerId ownership → updateStatus(NO_SHOW)
  getById(id, context)        → Assert caller is owner (customer or provider) → findById
  getByCustomerId(id)         → AppointmentRepository.findByCustomerId
  getForCurrentUser(ctx, f, p) → Route to findByCustomerId or findByProviderId by role


PaymentService
  createIntent(userId, input)
    → AppointmentRepository.findById — assert PENDING_PAYMENT, reservationExpiresAt > now
    → StripeAdapter.createPaymentIntent(amount, currency)
    → PaymentRepository.insert({ status: PENDING })
    → Return Payment with clientSecret

  confirmSuccess(userId, input)
    → PaymentRepository.update({ status: SUCCEEDED })
    → AppointmentRepository.updateStatus(CONFIRMED)
    → GoogleCalendarAdapter.createEvent(appointment)
    → NotificationService.sendBookingConfirmation(appointmentId)

  handleFailure(userId, input)
    → PaymentRepository.update({ status: FAILED })
    → NotificationService.sendPaymentFailedEmail(customerId)

  issueRefundIfEligible(paymentId, eligible)
    → If eligible: StripeAdapter.createRefund → PaymentRepository.setRefunded
    → NotificationService.sendRefundNotice(customerId)

  issueFullRefund(paymentId)
    → StripeAdapter.createRefund(full amount)
    → PaymentRepository.setRefunded
    → NotificationService.sendRefundNotice(customerId)


ReviewService
  submit(userId, input)
    → Resolve customerId
    → AppointmentRepository.findById — assert COMPLETED, owned by customer (BR-05)
    → ReviewRepository.findByAppointmentId — assert no existing review (FR-44)
    → ReviewRepository.insert
    → ProviderRepository.recalculateRating(providerId)  ← $avg aggregation
    → Return Review

  addReply(userId, input)
    → Resolve providerId
    → ReviewRepository.findById — assert provider ownership
    → Assert providerReply is null (single reply only — FR-46)
    → ReviewRepository.setProviderReply(reviewId, text)
    → Return updated Review

  getByAppointmentId(id)   → ReviewRepository.findByAppointmentId
  getByProviderId(id, p)   → ReviewRepository.findByProviderId
  getByCustomerId(userId)  → ReviewRepository.findByCustomerId


NotificationService
  sendBookingConfirmation(appointmentId)
    → NotificationRepository.insert ×2 (customer + provider)
    → MailAdapter.send(customer, booking_confirmation template)
    → MailAdapter.send(provider, new_booking_alert template)
  sendCancellationNotice(appointmentId, cancelledBy)
    → NotificationRepository.insert
    → MailAdapter.send(affected party, cancellation template)
  sendRescheduleNotice(appointmentId)
    → NotificationRepository.insert ×2
    → MailAdapter.send(customer + provider, reschedule template)
  sendReminder(appointmentId)
    → NotificationRepository.insert
    → MailAdapter.send(customer, reminder template)
    → AppointmentRepository.setReminderSent(appointmentId)
  sendPaymentFailedEmail(customerId)
    → NotificationRepository.insert → MailAdapter.send
  sendRefundNotice(customerId)
    → NotificationRepository.insert → MailAdapter.send


DashboardService
  getSummary(userId, dateRange)
    → Resolve providerId — ProviderRepository.findByUserId
    → AppointmentRepository.aggregateByStatus(providerId, dateRange)
    → PaymentRepository.sumRevenue(providerId, dateRange)
    → ProviderRepository.getRatingStats(providerId)
    → AppointmentRepository.getUpcoming(providerId, limit: 5)
    → Compose and return DashboardSummary
```

---

## 10. Repository Layer

Each repository encapsulates all Mongoose/MongoDB logic for one collection. Repositories return domain-typed objects only — never raw Mongoose documents.

```
UserRepository
  findById(id)
  findByEmail(email)
  findByVerificationToken(token)
  findByResetToken(token)
  insert(doc)
  update(id, patch)
  setVerified(id)
  setPasswordHash(id, hash)
  setStatus(id, status)
  setResetToken(id, token, expiresAt)
  clearResetToken(id)


ProviderRepository
  findById(id)
  findByUserId(userId)
  search(filter, pagination)            # text index + category / city filters
  insert(doc)
  update(id, patch)
  updateCalendarTokens(id, tokens)
  clearCalendarTokens(id)
  recalculateRating(id)                 # $avg pipeline over reviews collection
  getRatingStats(id)


CustomerRepository
  findById(id)
  findByUserId(userId)
  insert(doc)
  update(id, patch)


ServiceRepository
  findById(id)
  findActiveByProvider(providerId)
  insert(doc)
  update(id, patch)
  setActive(id, isActive)


WorkingHoursRepository
  findByProviderId(providerId)
  upsertByProvider(providerId, doc)
  pushException(providerId, exception)
  pullException(providerId, date)


AppointmentRepository
  findById(id)
  findByCustomerId(customerId, filter)
  findByProviderId(providerId, filter)
  atomicInsert(providerId, customerId, serviceId, startTime, endTime, expiresAt)
    # findOneAndUpdate upsert:false on compound partial index
    # returns null on conflict → slot taken
  atomicReschedule(appointmentId, newStartTime, newEndTime)
    # Two-phase: release old slot, lock new slot in single session transaction
  updateStatus(id, status, meta)
  setReminderSent(id)
  countFutureConfirmed(serviceId)       # guard for deactivateService
  aggregateByStatus(providerId, dateRange)
  sumRevenuePipeline(providerId, dateRange)
  getUpcoming(providerId, limit)
  findExpiredHolds()                    # SlotReleaseJob
  findDueReminders(windowStart, windowEnd)  # ReminderJob
  findDueTransitions()                  # StatusTransitionJob


PaymentRepository
  findById(id)
  findByAppointmentId(appointmentId)
  insert(doc)
  update(id, patch)
  setRefunded(id, refundDetail)
  sumRevenue(providerId, dateRange)     # $sum aggregation pipeline


ReviewRepository
  findById(id)
  findByAppointmentId(appointmentId)
  findByProviderId(providerId, pagination)
  findByCustomerId(customerId)
  insert(doc)
  setProviderReply(id, replyText, repliedAt)
  averageRatingByProvider(providerId)   # $avg pipeline — called by ProviderRepository


NotificationRepository
  findById(id)
  insert(doc)
  update(id, patch)
  findPendingRetries()                  # scheduled retry sweep
```

---

## 11. GraphQL Best Practices Applied

### 11.1 Schema-First Design

The SDL schema files (`*.typedefs.ts`, merged in `schema.ts`) are the authoritative contract, defined before resolver or service code is written. This enables Angular developers to build and mock against the schema in parallel with backend implementation, satisfying NFR-12's separation-of-concerns mandate. GraphQL Code Generator produces TypeScript types from the SDL for both client and server.

### 11.2 Declarative Authorization via @auth Directive

A custom `@auth(role: PROVIDER | CUSTOMER | ANY)` schema directive applied to protected query and mutation fields provides schema-visible, declarative access control that is impossible to accidentally omit from a new resolver. The directive wraps the resolver and checks `context.user.role` before the service layer is ever invoked. This satisfies FR-08 and NFR-06 at the API boundary.

### 11.3 DataLoader Batch Loading (N+1 Prevention)

Every field that resolves a reference relationship (e.g., `Appointment.customer`, `Service.provider`) uses a per-request DataLoader instance. DataLoaders coalesce all child-ID `.load()` calls within a single GraphQL execution tick into one batched MongoDB `find({ _id: { $in: [...ids] } })`. Without this, a query returning 20 appointments would trigger 20 individual customer lookups. DataLoaders are instantiated fresh per request in `context.ts`, preventing cross-request data leakage.

### 11.4 Thin Resolvers, Fat Services

Resolvers contain zero business logic. They: extract validated arguments from `args`, assert role authorization via context, delegate to a named service method, and return the result. All domain rules (BR-01–BR-10), cross-entity validations, and side-effect orchestration live exclusively in the service layer, making them unit-testable without a running HTTP or GraphQL runtime.

### 11.5 Custom Scalars for Domain Primitives

Three custom scalars enforce serialization at the API boundary: `Date` (ISO 8601 string ↔ JS Date object), `ObjectID` (opaque string ↔ BSON ObjectId), and `Decimal` (string ↔ Decimal128). This prevents raw MongoDB internals from surfacing to the client and guarantees Angular always receives predictable, typed values for monetary amounts and timestamps.

### 11.6 Service-Level Semantic Validation

SDL scalar and non-null enforcement handles structural type correctness. Semantic correctness (e.g., `rating` must be 1–5, `startTime` must be in the future, `confirmPassword` must match `password`) is validated in the service layer, not in resolvers, so the same validation fires regardless of whether the operation is triggered via GraphQL or a scheduler job.

### 11.7 Semantic Mutation Names (Operation-Oriented Design)

Every mutation expresses a business operation, not a resource update: `requestBooking`, `cancelAppointment`, `markNoShow`, `connectGoogleCalendar`. This makes the API self-documenting, aligns 1:1 with the Use Case names in the Software Analysis document, and allows each mutation to enforce its own specific preconditions, business rules, and side effects without ambiguity or shared-endpoint complexity.

### 11.8 ServiceSnapshot on Appointments

When an appointment is created, the service's name, price, currency, and duration are snapshotted onto the appointment document. This ensures that if a provider later edits or deletes the service, historical appointment records retain an accurate, immutable record of what was booked and what was charged — directly satisfying NFR-13 (auditability).

### 11.9 Persisted Queries (Production Recommendation)

Before promotion to production, all Angular query documents should be registered as persisted queries (hashed operation IDs transmitted instead of full query strings). This reduces payload size, prevents arbitrary query injection from unknown clients, and enables server-side query whitelisting — consistent with NFR-06 and NFR-07.

### 11.10 Query Complexity and Depth Limiting

A query complexity budget (maximum depth: 7 levels, maximum complexity score: 100 weighted units) is enforced as a validation rule before execution. This prevents malicious or accidental deeply-nested queries (e.g., `providers { appointments { provider { appointments { ... } } } }`) from triggering unbounded database fan-out, protecting the availability target in NFR-03 and the response-time budget in NFR-01.

### 11.11 Structured Error Taxonomy

The API surfaces a consistent error hierarchy through GraphQL's `extensions.code` field, giving Angular predictable, actionable error codes rather than raw message strings:

| Code | Meaning |
|---|---|
| `UNAUTHENTICATED` | Missing or invalid JWT |
| `FORBIDDEN` | Authenticated but wrong role or ownership |
| `VALIDATION_ERROR` | Input constraint violation |
| `NOT_FOUND` | Referenced entity does not exist |
| `CONFLICT` | Slot taken, duplicate review, existing reply |
| `PAYMENT_REQUIRED` | Booking exists but payment not completed |
| `PAYMENT_FAILED` | Stripe returned a failure status |
| `EXPIRED` | Reservation window has elapsed |
| `INTERNAL_ERROR` | Unexpected server fault — sanitized message only |

---

*End of Document*
