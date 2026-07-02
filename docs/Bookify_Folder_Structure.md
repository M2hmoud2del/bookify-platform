# Production Folder Structure

**Project:** Bookify – Smart Appointment & Business Management Platform  
**Document Version:** 1.0  
**Date:** June 30, 2026  
**Based On:** Bookify SRS v1.0 · Software Architecture v1.0 · GraphQL Architecture v1.0  
**Prepared By:** Senior Solution Architecture Team

---

## Repository Layout

Bookify is organized as a **monorepo** with two top-level workspace packages — `frontend` (Angular) and `backend` (Node.js). Shared tooling (linting, git hooks, CI scripts) lives at the root. Both workspaces are independently buildable and deployable while benefiting from atomic commits, shared PR review, and a unified CI pipeline.

```
bookify/
├── .github/
│   ├── workflows/
│   │   ├── ci-backend.yml              # Lint, test, build on PR (backend)
│   │   ├── ci-frontend.yml             # Lint, test, build on PR (frontend)
│   │   └── deploy.yml                  # Deploy to staging/prod on merge to main
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── .husky/
│   ├── pre-commit                      # Run lint-staged on staged files
│   └── commit-msg                      # Enforce conventional commit format
│
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf                      # Reverse proxy for production
│
├── docker-compose.yml                  # Local dev: mongo + backend + frontend
├── docker-compose.prod.yml             # Production-equivalent local smoke test
│
├── .env.example                        # Template for all environment variables
├── .editorconfig
├── .gitignore
├── .npmrc
├── package.json                        # Root npm workspaces definition
└── README.md
```

---

## Backend

```
backend/
│
├── package.json
├── tsconfig.json                       # Strict TypeScript config
├── tsconfig.build.json                 # Excludes test files from prod build
├── jest.config.ts
├── .eslintrc.js
├── .env.example
├── nodemon.json                        # Dev server watch config
│
├── dist/                               # Compiled output (git-ignored)
│
└── src/
    │
    ├── main.ts                         # Entry: bootstrap Express + Apollo + cron
    ├── app.ts                          # Express app factory (middleware wiring)
    │
    │
    ├── config/                         # ── CONFIGURATION ──────────────────────
    │   ├── index.ts                    # Re-exports all config
    │   ├── env.ts                      # Zod-validated environment variable schema
    │   ├── database.ts                 # MongoDB connection (Mongoose bootstrap)
    │   ├── apollo.ts                   # Apollo Server factory (schema, plugins, context)
    │   └── constants.ts               # App-wide constants (token TTLs, slot hold mins, etc.)
    │
    │
    ├── graphql/                        # ── GRAPHQL GATEWAY ─────────────────────
    │   ├── schema.ts                   # Merge all typeDefs + resolvers → executable schema
    │   ├── context.ts                  # Build GraphQL context per request (user, loaders)
    │   │
    │   ├── scalars/
    │   │   ├── index.ts
    │   │   ├── date.scalar.ts          # ISO 8601 Date ↔ JS Date
    │   │   ├── objectId.scalar.ts      # String ↔ MongoDB ObjectId
    │   │   └── decimal.scalar.ts       # String ↔ Decimal128 (monetary values)
    │   │
    │   ├── directives/
    │   │   ├── index.ts
    │   │   ├── auth.directive.ts       # @auth(role: PROVIDER | CUSTOMER | ANY)
    │   │   └── deprecated.directive.ts
    │   │
    │   ├── dataloaders/                # Batch loaders — N+1 prevention
    │   │   ├── index.ts                # Instantiate all loaders per request
    │   │   ├── user.loader.ts
    │   │   ├── provider.loader.ts
    │   │   ├── customer.loader.ts
    │   │   ├── service.loader.ts
    │   │   ├── appointment.loader.ts
    │   │   └── review.loader.ts
    │   │
    │   └── plugins/
    │       ├── complexity.plugin.ts    # Query depth + complexity limiting
    │       ├── logging.plugin.ts       # Request/response audit logging
    │       └── errorFormat.plugin.ts   # Sanitize + structure GraphQL errors
    │
    │
    ├── middleware/                     # ── EXPRESS MIDDLEWARE ──────────────────
    │   ├── index.ts
    │   ├── authenticate.ts             # JWT verification → attach user to req
    │   ├── rateLimiter.ts              # express-rate-limit per IP + per user
    │   ├── requestLogger.ts            # HTTP access log (Morgan / Pino)
    │   ├── errorHandler.ts             # Global Express error handler
    │   ├── helmet.ts                   # Security headers (CSP, HSTS, etc.)
    │   └── cors.ts                     # CORS policy configuration
    │
    │
    ├── modules/                        # ── FEATURE MODULES ─────────────────────
    │   │
    │   │
    │   ├── auth/                       # ── AUTHENTICATION ──────────────────────
    │   │   ├── index.ts
    │   │   ├── auth.typedefs.ts        # RegisterInput, LoginInput, AuthPayload
    │   │   ├── auth.resolvers.ts       # register, login, verifyEmail, resetPassword
    │   │   ├── auth.service.ts         # Hashing, JWT signing, token lifecycle
    │   │   ├── auth.repository.ts      # User persistence: insert, findByEmail, tokens
    │   │   ├── auth.helpers.ts         # generateToken(), hashPassword(), compareHash()
    │   │   ├── auth.validators.ts      # Zod schemas for inputs
    │   │   ├── auth.errors.ts          # AuthError, TokenExpiredError, UnverifiedError
    │   │   └── __tests__/
    │   │       ├── auth.service.test.ts
    │   │       └── auth.resolvers.test.ts
    │   │
    │   │
    │   ├── user/                       # ── USER (Base Identity) ─────────────────
    │   │   ├── index.ts
    │   │   ├── user.typedefs.ts        # User type, Role enum, me query
    │   │   ├── user.resolvers.ts       # me, deactivateAccount
    │   │   ├── user.service.ts         # Deactivation logic, status management
    │   │   ├── user.repository.ts      # findById, update, setStatus
    │   │   ├── user.model.ts           # Mongoose schema + model (users collection)
    │   │   ├── user.types.ts           # IUser, UserStatus
    │   │   └── __tests__/
    │   │       └── user.service.test.ts
    │   │
    │   │
    │   ├── provider/                   # ── PROVIDER ─────────────────────────────
    │   │   ├── index.ts
    │   │   ├── provider.typedefs.ts    # Provider, UpdateProviderInput, Address
    │   │   ├── provider.resolvers.ts   # provider, providers, myProviderProfile, update
    │   │   ├── provider.service.ts     # Profile logic, image upload orchestration
    │   │   ├── provider.repository.ts  # search, update, recalculateRating
    │   │   ├── provider.model.ts       # Mongoose schema (providers collection)
    │   │   ├── provider.types.ts       # IProvider, IAddress, IGoogleCalendarConfig
    │   │   ├── provider.validators.ts
    │   │   ├── provider.errors.ts
    │   │   └── __tests__/
    │   │       ├── provider.service.test.ts
    │   │       └── provider.resolvers.test.ts
    │   │
    │   │
    │   ├── customer/                   # ── CUSTOMER ─────────────────────────────
    │   │   ├── index.ts
    │   │   ├── customer.typedefs.ts
    │   │   ├── customer.resolvers.ts   # myCustomerProfile, updateCustomerProfile
    │   │   ├── customer.service.ts
    │   │   ├── customer.repository.ts
    │   │   ├── customer.model.ts       # Mongoose schema (customers collection)
    │   │   ├── customer.types.ts       # ICustomer
    │   │   ├── customer.validators.ts
    │   │   └── __tests__/
    │   │       └── customer.service.test.ts
    │   │
    │   │
    │   ├── service/                    # ── SERVICES (Bookable Offerings) ────────
    │   │   ├── index.ts
    │   │   ├── service.typedefs.ts     # Service, CreateServiceInput, UpdateServiceInput
    │   │   ├── service.resolvers.ts    # service, servicesByProvider, create, update, deactivate
    │   │   ├── service.service.ts      # Validation, activation/deactivation rules (BR-07)
    │   │   ├── service.repository.ts   # findActiveByProvider, setActive
    │   │   ├── service.model.ts        # Mongoose schema (services collection)
    │   │   ├── service.types.ts        # IService
    │   │   ├── service.validators.ts
    │   │   ├── service.errors.ts       # ServiceHasActiveBookingsError
    │   │   └── __tests__/
    │   │       ├── service.service.test.ts
    │   │       └── service.resolvers.test.ts
    │   │
    │   │
    │   ├── workingHours/               # ── WORKING HOURS & AVAILABILITY ─────────
    │   │   ├── index.ts
    │   │   ├── workingHours.typedefs.ts # WorkingHours, ScheduleEntry, Slot, SlotAvailability
    │   │   ├── workingHours.resolvers.ts # myWorkingHours, availableSlots, setWorkingHours
    │   │   ├── workingHours.service.ts  # Slot generation algorithm (FR-16–FR-19)
    │   │   ├── workingHours.repository.ts # upsert, pushException, pullException
    │   │   ├── workingHours.model.ts
    │   │   ├── workingHours.types.ts    # IWorkingHours, IScheduleEntry, IScheduleException
    │   │   ├── workingHours.validators.ts
    │   │   ├── slot.generator.ts        # Pure function: schedule + service → Slot[]
    │   │   └── __tests__/
    │   │       ├── workingHours.service.test.ts
    │   │       └── slot.generator.test.ts
    │   │
    │   │
    │   ├── appointment/                # ── APPOINTMENTS ─────────────────────────
    │   │   ├── index.ts
    │   │   ├── appointment.typedefs.ts  # Appointment, AppointmentStatus, all inputs
    │   │   ├── appointment.resolvers.ts # appointment, myAppointments, requestBooking, cancel, ...
    │   │   ├── appointment.service.ts   # reserveSlot, cancel, reschedule, lifecycle (FR-23–FR-33)
    │   │   ├── appointment.repository.ts # atomicInsert, atomicReschedule, aggregations
    │   │   ├── appointment.model.ts
    │   │   ├── appointment.types.ts     # IAppointment, AppointmentStatus, IServiceSnapshot
    │   │   ├── appointment.validators.ts
    │   │   ├── appointment.errors.ts    # SlotConflictError, ReservationExpiredError
    │   │   ├── appointment.policies.ts  # Cancellation + reschedule eligibility (BR-03, BR-04)
    │   │   └── __tests__/
    │   │       ├── appointment.service.test.ts
    │   │       ├── appointment.repository.test.ts
    │   │       └── appointment.resolvers.test.ts
    │   │
    │   │
    │   ├── payment/                    # ── PAYMENTS ─────────────────────────────
    │   │   ├── index.ts
    │   │   ├── payment.typedefs.ts     # Payment, RefundDetail, PaymentStatus
    │   │   ├── payment.resolvers.ts    # paymentByAppointment, initiatePayment, confirmPayment
    │   │   ├── payment.service.ts      # Intent creation, confirm, refund orchestration
    │   │   ├── payment.repository.ts   # insert, setRefunded, sumRevenue aggregation
    │   │   ├── payment.model.ts        # Mongoose schema (payments collection)
    │   │   ├── payment.types.ts        # IPayment, IRefundDetail, PaymentStatus
    │   │   ├── payment.validators.ts
    │   │   ├── payment.errors.ts       # PaymentFailedError, RefundError
    │   │   ├── refund.policy.ts        # Refund eligibility rules (BR-03, BR-04)
    │   │   └── __tests__/
    │   │       ├── payment.service.test.ts
    │   │       └── refund.policy.test.ts
    │   │
    │   │
    │   ├── review/                     # ── REVIEWS ──────────────────────────────
    │   │   ├── index.ts
    │   │   ├── review.typedefs.ts      # Review, ProviderReply, SubmitReviewInput
    │   │   ├── review.resolvers.ts     # reviewsByProvider, myReviews, submitReview, replyToReview
    │   │   ├── review.service.ts       # Eligibility check, dedup, rating recalc (FR-43–FR-46)
    │   │   ├── review.repository.ts    # insert, setProviderReply, averageRating aggregation
    │   │   ├── review.model.ts         # Mongoose schema (reviews collection)
    │   │   ├── review.types.ts         # IReview, IProviderReply
    │   │   ├── review.validators.ts    # rating 1–5, comment max length
    │   │   ├── review.errors.ts        # DuplicateReviewError, ReplyAlreadyExistsError
    │   │   └── __tests__/
    │   │       └── review.service.test.ts
    │   │
    │   │
    │   ├── notification/               # ── NOTIFICATIONS ────────────────────────
    │   │   ├── index.ts
    │   │   ├── notification.typedefs.ts
    │   │   ├── notification.resolvers.ts
    │   │   ├── notification.service.ts  # Dispatch orchestration + retry logic (FR-39–FR-42)
    │   │   ├── notification.repository.ts # insert, update, findPendingRetries
    │   │   ├── notification.model.ts    # Mongoose schema (notifications collection)
    │   │   ├── notification.types.ts    # INotification, NotificationType, NotificationStatus
    │   │   ├── templates/               # Email HTML/text templates
    │   │   │   ├── index.ts             # Template renderer (Handlebars)
    │   │   │   ├── booking-confirmation.hbs
    │   │   │   ├── new-booking-alert.hbs
    │   │   │   ├── reminder.hbs
    │   │   │   ├── cancellation.hbs
    │   │   │   ├── reschedule.hbs
    │   │   │   ├── review-request.hbs
    │   │   │   ├── payment-failed.hbs
    │   │   │   ├── refund-issued.hbs
    │   │   │   ├── email-verification.hbs
    │   │   │   └── password-reset.hbs
    │   │   └── __tests__/
    │   │       └── notification.service.test.ts
    │   │
    │   │
    │   └── dashboard/                  # ── DASHBOARD ────────────────────────────
    │       ├── index.ts
    │       ├── dashboard.typedefs.ts    # DashboardSummary, DateRangeInput
    │       ├── dashboard.resolvers.ts   # providerDashboard query
    │       ├── dashboard.service.ts     # Aggregation across Appt / Payment / Review
    │       ├── dashboard.types.ts       # IDashboardSummary
    │       └── __tests__/
    │           └── dashboard.service.test.ts
    │
    │
    ├── integrations/                   # ── THIRD-PARTY ADAPTERS ─────────────────
    │   ├── index.ts
    │   │
    │   ├── stripe/
    │   │   ├── index.ts
    │   │   ├── stripe.adapter.ts        # createPaymentIntent(), createRefund()
    │   │   ├── stripe.client.ts         # Stripe SDK singleton (lazy init)
    │   │   ├── stripe.types.ts          # PaymentIntentResult, RefundResult
    │   │   ├── stripe.errors.ts         # StripeAdapterError (wraps SDK errors)
    │   │   └── __tests__/
    │   │       └── stripe.adapter.test.ts
    │   │
    │   ├── googleCalendar/
    │   │   ├── index.ts
    │   │   ├── googleCalendar.adapter.ts # exchangeAuthCode, createEvent, updateEvent, deleteEvent
    │   │   ├── googleCalendar.client.ts  # Google API OAuth2 client factory
    │   │   ├── googleCalendar.types.ts   # CalendarEventInput, CalendarEventResult
    │   │   ├── googleCalendar.errors.ts  # TokenRevokedError, CalendarSyncError
    │   │   └── __tests__/
    │   │       └── googleCalendar.adapter.test.ts
    │   │
    │   ├── cloudinary/
    │   │   ├── index.ts
    │   │   ├── cloudinary.adapter.ts    # upload(), delete(), generateSecureUrl()
    │   │   ├── cloudinary.client.ts     # Cloudinary SDK config singleton
    │   │   ├── cloudinary.types.ts      # UploadResult
    │   │   ├── cloudinary.errors.ts
    │   │   └── __tests__/
    │   │       └── cloudinary.adapter.test.ts
    │   │
    │   └── mail/
    │       ├── index.ts
    │       ├── mail.adapter.ts          # send(to, subject, html, text)
    │       ├── mail.client.ts           # Nodemailer transporter singleton
    │       ├── mail.types.ts            # MailMessage, MailResult
    │       ├── mail.errors.ts           # MailDeliveryError
    │       └── __tests__/
    │           └── mail.adapter.test.ts
    │
    │
    ├── scheduler/                      # ── BACKGROUND JOBS (node-cron) ──────────
    │   ├── index.ts                    # Register + start all cron jobs on bootstrap
    │   ├── scheduler.bootstrap.ts      # Leader check, job registration, error isolation
    │   ├── scheduler.types.ts          # IJob interface { name, schedule, execute() }
    │   └── jobs/
    │       ├── reminder.job.ts         # FR-40: send reminders N hours before appointment
    │       ├── statusTransition.job.ts # FR-33: Confirmed → Completed past endTime
    │       ├── slotRelease.job.ts      # FR-26: release expired pending_payment holds
    │       └── __tests__/
    │           ├── reminder.job.test.ts
    │           ├── statusTransition.job.test.ts
    │           └── slotRelease.job.test.ts
    │
    │
    ├── shared/                         # ── SHARED DOMAIN TYPES & BASE CLASSES ───
    │   ├── index.ts
    │   ├── base.repository.ts          # Abstract base: shared Mongoose query helpers
    │   ├── pagination.types.ts         # PaginationInput, PaginatedResult<T>
    │   ├── filter.types.ts             # Shared filter type structures
    │   ├── errors/
    │   │   ├── index.ts
    │   │   ├── app.error.ts            # Base AppError (extends Error + code + httpStatus)
    │   │   ├── not-found.error.ts
    │   │   ├── forbidden.error.ts
    │   │   ├── conflict.error.ts
    │   │   ├── validation.error.ts
    │   │   ├── unauthenticated.error.ts
    │   │   └── internal.error.ts
    │   └── guards/
    │       ├── isOwner.guard.ts        # Assert resource belongs to calling user
    │       └── isRole.guard.ts         # Assert calling user has required role
    │
    │
    ├── utils/                          # ── UTILITIES ────────────────────────────
    │   ├── index.ts
    │   ├── jwt.util.ts                 # sign(), verify(), decode()
    │   ├── hash.util.ts                # hashPassword(), comparePassword()
    │   ├── token.util.ts               # generateSecureToken(), isTokenExpired()
    │   ├── date.util.ts                # addMinutes(), isInFuture(), toUTC(), formatISO()
    │   ├── pagination.util.ts          # buildSkipLimit(), buildMeta()
    │   ├── objectId.util.ts            # toObjectId(), isValidObjectId()
    │   ├── logger.ts                   # Structured Pino logger — singleton
    │   └── __tests__/
    │       ├── jwt.util.test.ts
    │       ├── hash.util.test.ts
    │       └── date.util.test.ts
    │
    │
    └── tests/                          # ── INTEGRATION & E2E TESTS ──────────────
        ├── setup.ts                    # Global Jest setup (in-memory MongoDB, test Apollo)
        ├── teardown.ts
        ├── helpers/
        │   ├── graphql.client.ts       # Test Apollo client factory
        │   ├── seed.ts                 # Seed helpers: createTestUser, createTestProvider
        │   └── factories/
        │       ├── user.factory.ts
        │       ├── provider.factory.ts
        │       ├── appointment.factory.ts
        │       └── payment.factory.ts
        └── integration/
            ├── auth.integration.test.ts
            ├── booking.integration.test.ts
            ├── payment.integration.test.ts
            ├── review.integration.test.ts
            └── dashboard.integration.test.ts
```

---

## Frontend

```
frontend/
│
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── angular.json
├── .eslintrc.json
├── .prettierrc
├── jest.config.ts                       # Jest + jest-preset-angular
├── codegen.ts                           # GraphQL Code Generator config
│                                        # Reads schema from API, emits:
│                                        # core/graphql/generated/graphql.ts
│
└── src/
    │
    ├── main.ts                          # Angular bootstrap
    ├── index.html
    ├── styles.scss                      # Global styles + design token imports
    │
    ├── environments/
    │   ├── environment.ts               # Dev: GraphQL endpoint, Stripe publishable key
    │   └── environment.prod.ts          # Prod: GraphQL endpoint, Stripe publishable key
    │
    │
    └── app/
        ├── app.component.ts
        ├── app.component.html
        ├── app.component.scss
        ├── app.config.ts                # provideRouter, provideApollo, provideHttpClient
        ├── app.routes.ts                # Root lazy-loaded route definitions
        │
        │
        ├── core/                        # ── CORE (singleton services, guards, Apollo) ──
        │   ├── core.module.ts           # Imported once in AppModule only
        │   │
        │   ├── auth/
        │   │   ├── auth.service.ts      # login(), register(), logout(), currentUser$
        │   │   ├── auth.guard.ts        # CanActivate: requires authentication
        │   │   ├── role.guard.ts        # CanActivate: requires PROVIDER or CUSTOMER
        │   │   ├── auth.interceptor.ts  # Attach JWT Bearer token to every request
        │   │   ├── token.service.ts     # Store/retrieve/clear JWT (sessionStorage)
        │   │   └── auth.models.ts       # AuthPayload, CurrentUser interfaces
        │   │
        │   ├── apollo/
        │   │   ├── apollo.factory.ts    # ApolloClientOptions factory
        │   │   ├── apollo.error.handler.ts  # Global GraphQL error interceptor
        │   │   └── apollo.cache.ts      # InMemoryCache field policies (pagination, etc.)
        │   │
        │   ├── graphql/
        │   │   └── generated/
        │   │       └── graphql.ts       # AUTO-GENERATED — do not edit manually
        │   │                            # TypeScript types + typed Angular Apollo services
        │   │                            # for the entire Bookify schema
        │   │
        │   └── services/
        │       ├── error.service.ts     # Global error notification dispatcher
        │       └── storage.service.ts   # Typed localStorage/sessionStorage wrapper
        │
        │
        ├── shared/                      # ── SHARED UI (dumb components, pipes, directives)
        │   ├── shared.module.ts
        │   │
        │   ├── components/
        │   │   ├── button/
        │   │   │   ├── button.component.ts
        │   │   │   ├── button.component.html
        │   │   │   └── button.component.scss
        │   │   ├── input/
        │   │   ├── modal/
        │   │   ├── spinner/
        │   │   ├── toast/
        │   │   ├── avatar/
        │   │   ├── badge/
        │   │   ├── card/
        │   │   ├── empty-state/
        │   │   ├── pagination/
        │   │   ├── star-rating/
        │   │   └── date-picker/
        │   │
        │   ├── pipes/
        │   │   ├── time-ago.pipe.ts
        │   │   ├── currency-format.pipe.ts
        │   │   ├── appointment-status.pipe.ts
        │   │   └── duration.pipe.ts
        │   │
        │   ├── directives/
        │   │   ├── click-outside.directive.ts
        │   │   └── autofocus.directive.ts
        │   │
        │   └── validators/
        │       ├── password-match.validator.ts
        │       └── future-date.validator.ts
        │
        │
        ├── layout/                      # ── LAYOUT SHELLS ────────────────────────
        │   ├── provider-layout/
        │   │   ├── provider-layout.component.ts
        │   │   ├── provider-layout.component.html
        │   │   ├── provider-layout.component.scss
        │   │   ├── provider-sidebar/
        │   │   └── provider-topbar/
        │   │
        │   ├── customer-layout/
        │   │   ├── customer-layout.component.ts
        │   │   ├── customer-layout.component.html
        │   │   ├── customer-layout.component.scss
        │   │   ├── customer-navbar/
        │   │   └── customer-footer/
        │   │
        │   └── public-layout/
        │       ├── public-layout.component.ts
        │       ├── public-layout.component.html
        │       └── public-layout.component.scss
        │
        │
        ├── features/                    # ── FEATURE MODULES (all lazy-loaded) ────
        │   │
        │   │
        │   ├── auth/                    # ── AUTHENTICATION ───────────────────────
        │   │   ├── auth.routes.ts
        │   │   ├── pages/
        │   │   │   ├── login/
        │   │   │   │   ├── login.component.ts
        │   │   │   │   ├── login.component.html
        │   │   │   │   └── login.component.scss
        │   │   │   ├── register/
        │   │   │   │   ├── register.component.ts
        │   │   │   │   ├── register.component.html
        │   │   │   │   └── register.component.scss
        │   │   │   ├── verify-email/
        │   │   │   ├── forgot-password/
        │   │   │   └── reset-password/
        │   │   ├── graphql/
        │   │   │   ├── register.mutation.ts
        │   │   │   ├── login.mutation.ts
        │   │   │   └── reset-password.mutation.ts
        │   │   └── __tests__/
        │   │       └── login.component.spec.ts
        │   │
        │   │
        │   ├── provider/                # ── PROVIDER PORTAL ──────────────────────
        │   │   ├── provider.routes.ts
        │   │   │
        │   │   ├── pages/
        │   │   │   │
        │   │   │   ├── dashboard/
        │   │   │   │   ├── dashboard.component.ts
        │   │   │   │   ├── dashboard.component.html
        │   │   │   │   ├── dashboard.component.scss
        │   │   │   │   └── components/
        │   │   │   │       ├── stats-card/
        │   │   │   │       ├── revenue-chart/
        │   │   │   │       └── upcoming-list/
        │   │   │   │
        │   │   │   ├── profile/
        │   │   │   │   ├── profile.component.ts
        │   │   │   │   ├── profile.component.html
        │   │   │   │   └── profile.component.scss
        │   │   │   │
        │   │   │   ├── services/
        │   │   │   │   ├── service-list/
        │   │   │   │   │   ├── service-list.component.ts
        │   │   │   │   │   └── service-list.component.html
        │   │   │   │   └── service-form/
        │   │   │   │       ├── service-form.component.ts
        │   │   │   │       └── service-form.component.html
        │   │   │   │
        │   │   │   ├── working-hours/
        │   │   │   │   ├── working-hours.component.ts
        │   │   │   │   ├── working-hours.component.html
        │   │   │   │   └── components/
        │   │   │   │       ├── schedule-grid/
        │   │   │   │       └── exception-form/
        │   │   │   │
        │   │   │   ├── appointments/
        │   │   │   │   ├── appointment-list/
        │   │   │   │   │   ├── appointment-list.component.ts
        │   │   │   │   │   └── appointment-list.component.html
        │   │   │   │   └── appointment-detail/
        │   │   │   │       ├── appointment-detail.component.ts
        │   │   │   │       └── appointment-detail.component.html
        │   │   │   │
        │   │   │   └── reviews/
        │   │   │       ├── review-list/
        │   │   │       └── review-reply-form/
        │   │   │
        │   │   ├── graphql/
        │   │   │   ├── provider-dashboard.query.ts
        │   │   │   ├── update-provider.mutation.ts
        │   │   │   ├── my-appointments.query.ts
        │   │   │   ├── mark-completed.mutation.ts
        │   │   │   ├── mark-no-show.mutation.ts
        │   │   │   ├── cancel-by-provider.mutation.ts
        │   │   │   ├── connect-google-calendar.mutation.ts
        │   │   │   └── reviews-by-provider.query.ts
        │   │   │
        │   │   └── __tests__/
        │   │       ├── dashboard.component.spec.ts
        │   │       └── service-form.component.spec.ts
        │   │
        │   │
        │   ├── customer/                # ── CUSTOMER PORTAL ──────────────────────
        │   │   ├── customer.routes.ts
        │   │   │
        │   │   ├── pages/
        │   │   │   │
        │   │   │   ├── home/
        │   │   │   │   ├── home.component.ts
        │   │   │   │   ├── home.component.html
        │   │   │   │   └── components/
        │   │   │   │       ├── category-filter/
        │   │   │   │       └── provider-card/
        │   │   │   │
        │   │   │   ├── search/
        │   │   │   │   ├── search.component.ts
        │   │   │   │   └── search.component.html
        │   │   │   │
        │   │   │   ├── provider-profile/
        │   │   │   │   ├── provider-profile.component.ts
        │   │   │   │   ├── provider-profile.component.html
        │   │   │   │   └── components/
        │   │   │   │       ├── service-list/
        │   │   │   │       └── review-list/
        │   │   │   │
        │   │   │   ├── booking/
        │   │   │   │   ├── booking.component.ts
        │   │   │   │   ├── booking.component.html
        │   │   │   │   ├── booking.component.scss
        │   │   │   │   └── components/
        │   │   │   │       ├── slot-picker/
        │   │   │   │       │   ├── slot-picker.component.ts
        │   │   │   │       │   └── slot-picker.component.html
        │   │   │   │       └── booking-summary/
        │   │   │   │
        │   │   │   ├── payment/
        │   │   │   │   ├── payment.component.ts
        │   │   │   │   ├── payment.component.html
        │   │   │   │   └── components/
        │   │   │   │       ├── stripe-card-element/
        │   │   │   │       │   ├── stripe-card-element.component.ts
        │   │   │   │       │   └── stripe-card-element.component.html
        │   │   │   │       └── payment-summary/
        │   │   │   │
        │   │   │   ├── booking-confirmation/
        │   │   │   │   ├── booking-confirmation.component.ts
        │   │   │   │   └── booking-confirmation.component.html
        │   │   │   │
        │   │   │   ├── appointments/
        │   │   │   │   ├── my-appointments/
        │   │   │   │   │   ├── my-appointments.component.ts
        │   │   │   │   │   └── my-appointments.component.html
        │   │   │   │   └── appointment-detail/
        │   │   │   │       ├── appointment-detail.component.ts
        │   │   │   │       └── appointment-detail.component.html
        │   │   │   │
        │   │   │   ├── profile/
        │   │   │   │   ├── profile.component.ts
        │   │   │   │   └── profile.component.html
        │   │   │   │
        │   │   │   └── review/
        │   │   │       ├── submit-review/
        │   │   │       │   ├── submit-review.component.ts
        │   │   │       │   └── submit-review.component.html
        │   │   │       └── my-reviews/
        │   │   │
        │   │   ├── graphql/
        │   │   │   ├── providers.query.ts
        │   │   │   ├── provider.query.ts
        │   │   │   ├── available-slots.query.ts
        │   │   │   ├── request-booking.mutation.ts
        │   │   │   ├── initiate-payment.mutation.ts
        │   │   │   ├── confirm-payment.mutation.ts
        │   │   │   ├── handle-payment-failure.mutation.ts
        │   │   │   ├── cancel-appointment.mutation.ts
        │   │   │   ├── reschedule-appointment.mutation.ts
        │   │   │   ├── submit-review.mutation.ts
        │   │   │   └── my-appointments.query.ts
        │   │   │
        │   │   └── __tests__/
        │   │       ├── booking.component.spec.ts
        │   │       ├── payment.component.spec.ts
        │   │       └── slot-picker.component.spec.ts
        │   │
        │   │
        │   └── public/                  # ── PUBLIC PAGES (unauthenticated) ───────
        │       ├── public.routes.ts
        │       └── pages/
        │           ├── landing/
        │           │   ├── landing.component.ts
        │           │   └── landing.component.html
        │           └── not-found/
        │               ├── not-found.component.ts
        │               └── not-found.component.html
        │
        │
        └── store/                       # ── CLIENT STATE ─────────────────────────
            ├── auth.store.ts            # currentUser, isAuthenticated, role signal
            ├── booking.store.ts         # selectedProvider, selectedService, selectedSlot
            └── notification.store.ts    # In-app toast queue
```

---

## Naming Conventions

| Concern | Convention | Example |
|---|---|---|
| Backend files | `kebab-case.<layer>.ts` | `appointment.service.ts` |
| Frontend components | `kebab-case.component.ts` | `slot-picker.component.ts` |
| GraphQL operations (FE) | `kebab-case.query.ts` / `.mutation.ts` | `request-booking.mutation.ts` |
| Interfaces / Types (BE) | `PascalCase` prefixed with `I` | `IAppointment`, `IProvider` |
| Mongoose models | `PascalCase` + `Model` suffix | `AppointmentModel` |
| Enum values | `UPPER_SNAKE_CASE` | `AppointmentStatus.CONFIRMED` |
| Constants | `UPPER_SNAKE_CASE` | `SLOT_HOLD_MINUTES` |
| Environment variables | `UPPER_SNAKE_CASE` | `MONGO_URI`, `JWT_SECRET` |
| Backend tests | Co-located `__tests__/` | `appointment.service.test.ts` |
| Frontend tests | Co-located `.spec.ts` | `login.component.spec.ts` |

---

## Key Architectural Decisions Reflected in This Structure

### One folder per domain module, no exceptions

Every domain (auth, user, provider, customer, service, workingHours, appointment, payment, review, notification, dashboard) owns exactly one folder under `modules/`. Each folder is self-contained: typedefs, resolvers, service, repository, model, types, validators, errors, and tests all live together. The blast radius of any change is confined to one folder, and the owning team for any piece of code is immediately obvious from its path.

### Policies and generators as distinct files within a module

Business rule logic dense enough to warrant isolation lives in its own file within the module: `refund.policy.ts` (BR-03, BR-04), `appointment.policies.ts` (cancellation/reschedule eligibility), and `slot.generator.ts` (the pure slot-generation function). These are individually unit-testable without instantiating a service, and they make the rules discoverable without reading through hundreds of lines of service code.

### Integration adapters fully isolated from feature modules

Third-party SDK code (Stripe, Google Calendar, Cloudinary, Nodemailer) lives exclusively in `integrations/`, structured as one sub-folder per vendor, each with its own client singleton, typed adapter, typed results, and typed errors. No feature module ever imports a vendor SDK directly — only the adapter's TypeScript interface. Swapping a vendor (e.g., from Stripe to a different payment gateway) means changing one adapter file and its client, with zero changes to `payment.service.ts`.

### Scheduler as a top-level sibling, not inside a module

Scheduler jobs are cross-cutting orchestrators: `reminder.job.ts` calls `NotificationService`, and `statusTransition.job.ts` calls `AppointmentService`. Placing the scheduler at the `src/` level (alongside `modules/` and `integrations/`) makes its cross-module nature structurally explicit and prevents the circular-import risk that would arise if a job lived inside one of the modules it depends on.

### GraphQL infrastructure separated from feature typedefs

`src/graphql/` contains only gateway infrastructure — scalars, directives, dataloaders, plugins, and the schema merge point. Feature-specific SDL (`*.typedefs.ts`) and resolvers (`*.resolvers.ts`) live inside their owning module. The schema merge in `graphql/schema.ts` simply imports and combines them. This keeps the gateway thin and prevents a sprawling, centralized `schema.graphql` that becomes a merge-conflict bottleneck on every feature addition.

### GraphQL Code Generator as the frontend–backend contract enforcer

`codegen.ts` at the frontend root drives GraphQL Code Generator, which reads the live schema endpoint and emits `core/graphql/generated/graphql.ts` — a single file containing all TypeScript types, operation result types, variable types, and typed Angular Apollo services for every query and mutation in the schema. Feature modules import from `generated/` only; they never manually declare types for API responses. A breaking schema change fails the codegen step in CI before any human writes a single Angular component method.

### Lazy-loaded feature chunks for each portal

`features/auth/`, `features/provider/`, and `features/customer/` are each independently lazy-loaded Angular route chunks. The browser downloads only the provider portal bundle when a provider navigates, and only the customer portal bundle when a customer navigates — consistent with NFR-11's responsiveness requirement and good SPA bundle-size hygiene.

---

*End of Document*
