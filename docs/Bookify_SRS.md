# Software Requirements Specification

**Project:** Bookify – Smart Appointment & Business Management Platform
**Document Version:** 1.0
**Date:** June 30, 2026
**Prepared By:** Software Architecture & Business Analysis Team
**Standard:** IEEE 830 / IEEE 29148-style SRS

---

## 1. Introduction

This Software Requirements Specification (SRS) describes the functional and non-functional requirements for **Bookify**, a multi-tenant SaaS platform that enables appointment-based service businesses to manage their operations and allows customers to discover, book, and pay for services online. This document is intended to serve as the single source of truth for the engineering, QA, product, and DevOps teams throughout the design, development, and validation phases of the project.

### 1.1 Document Conventions

- "Shall" denotes a mandatory requirement.
- "Should" denotes a recommended but non-mandatory requirement.
- Requirement IDs follow the pattern `FR-XX` (Functional) and `NFR-XX` (Non-Functional) for traceability.

### 1.2 Intended Audience

Backend engineers, frontend engineers, QA engineers, DevOps engineers, project managers, UX designers, and business stakeholders.

### 1.3 Project Background

Independent service providers (clinics, salons, consultants, freelancers, photographers, trainers, lawyers) typically rely on manual scheduling (phone calls, spreadsheets, paper diaries) or fragmented tools that don't combine booking, payment, and reminders in a single workflow. Bookify consolidates these needs into one SaaS product, reducing no-shows, administrative overhead, and missed revenue.

---

## 2. Purpose

The purpose of this document is to:

- Define the complete functional and non-functional scope of the Bookify platform for Release 1.0.
- Establish a shared, unambiguous understanding between business stakeholders and the engineering team.
- Serve as the baseline for system design, test case derivation, and acceptance sign-off.
- Define integration boundaries with third-party systems (Stripe, Google Calendar, Cloudinary, Nodemailer).

This document does not include UML diagrams, source code, database schemas, or API contracts — those are covered in separate technical design documents that derive from this SRS.

---

## 3. Scope

### 3.1 Product Scope

Bookify is a web-based SaaS platform consisting of:

- A **Provider Portal** (Angular web application) where service providers manage their business profile, services, working hours, appointments, and performance dashboard.
- A **Customer Portal** (Angular web application) where customers browse providers/services, book and pay for appointments, manage their bookings, and leave reviews.
- A **Backend API** (Node.js, Express, GraphQL, MongoDB) serving both portals through a unified GraphQL API layer.
- **Background job processing** (node-cron) for reminders, expired-slot cleanup, and scheduled notifications.
- **Third-party integrations**: Stripe Sandbox (payments), Google Calendar API (calendar sync), Cloudinary (media storage), Nodemailer (transactional email).

### 3.2 In Scope (Release 1.0)

- Provider and Customer registration/authentication
- Service and working-hours management
- Real-time appointment booking with conflict prevention
- Online payment processing (Stripe Sandbox)
- Appointment lifecycle management (book, reschedule, cancel)
- Automated email reminders
- Reviews and ratings
- Provider analytics dashboard
- Google Calendar two-way sync for providers

### 3.3 Out of Scope (Release 1.0)

- Native mobile applications (iOS/Android)
- SMS/WhatsApp notifications
- Multi-staff/multi-location provider accounts (a provider account represents a single practitioner/business unit in v1.0)
- In-app messaging/chat between provider and customer
- Marketplace-wide search engine optimization tooling
- Multi-currency/multi-language support
- Admin/super-admin role (explicitly excluded — only Provider and Customer roles exist per project requirements)

---

## 4. Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| Provider | A registered business/professional offering bookable services on Bookify |
| Customer | A registered end-user who books and pays for services |
| Service | A bookable offering created by a Provider (e.g., "30-min Consultation") with a defined price and duration |
| Slot | A discrete time interval during which a service can be booked |
| Booking / Appointment | A confirmed reservation of a slot by a Customer for a specific Service |
| Working Hours | The recurring weekly availability window configured by a Provider |
| SaaS | Software as a Service |
| SRS | Software Requirements Specification |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| PCI-DSS | Payment Card Industry Data Security Standard |
| Cron Job | A scheduled, recurring background task |
| No-show | A booked appointment where the Customer does not attend and does not cancel |

---

## 5. Overall Description

### 5.1 Product Perspective

Bookify is a new, standalone, cloud-hosted SaaS product. It is a multi-tenant system in which each Provider operates an independent business presence, while Customers can interact with multiple Providers using a single account. The system architecture follows a layered approach: Angular SPA clients communicate with a single GraphQL API gateway, which orchestrates business logic, persistence (MongoDB), and third-party integrations.

### 5.2 Product Functions (Summary)

- Account registration and authentication for two distinct roles
- Provider business configuration (profile, services, availability)
- Service discovery and booking by Customers
- Payment capture and confirmation
- Appointment lifecycle and notification management
- Review and rating collection
- Provider performance dashboard and reporting

### 5.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency |
|---|---|---|
| Provider | Independent professional or small business owner managing their own schedule and services | Low to moderate; expects a simple, guided UI |
| Customer | General public booking appointments | Low; expects a fast, frictionless booking flow comparable to consumer e-commerce |

### 5.4 Operating Environment

- **Client:** Modern evergreen web browsers (Chrome, Edge, Firefox, Safari — latest two major versions), desktop and responsive mobile web.
- **Server:** Node.js runtime (LTS version), containerized deployment (e.g., Docker), cloud hosting (e.g., AWS/GCP/Azure).
- **Database:** MongoDB (managed cluster, e.g., Atlas).
- **Third-party services:** Stripe Sandbox, Google Calendar API, Cloudinary, Nodemailer (SMTP relay).

### 5.5 Design and Implementation Constraints

- Backend must be implemented using Node.js, Express, and GraphQL (single API layer; no parallel REST API for core domain operations).
- Persistence must use MongoDB (document-oriented schema design).
- Frontend must be implemented in Angular.
- Background/scheduled tasks must use node-cron.
- Payment processing restricted to Stripe **Sandbox** environment for this release (no live transactions).

### 5.6 Assumptions and Dependencies

See Sections 11 and 12.

---

## 6. User Roles

Bookify defines exactly **two** user roles. There is no administrative/super-admin role in this release.

### 6.1 Provider

A Provider is a service-offering business or individual. Capabilities:

- Register and manage a business profile (name, category, description, logo/photos, contact details, location)
- Create, edit, and deactivate services (name, description, price, duration, category)
- Define and update recurring working hours and block out exceptions (holidays, time off)
- View, accept, reschedule, and cancel appointments
- View a dashboard summarizing bookings, revenue, and performance metrics
- View and respond to customer reviews
- Connect/sync their schedule with Google Calendar

### 6.2 Customer

A Customer is an end-user seeking to book services. Capabilities:

- Register and manage a personal profile
- Browse/search Providers and Services by category, location, and availability
- View Provider profiles, service details, and reviews
- Book an appointment for an available slot
- Pay for the appointment online (Stripe Sandbox)
- Cancel or reschedule an appointment (subject to business rules)
- Receive email reminders and confirmations
- Submit a review and rating after a completed appointment

---

## 7. Functional Requirements

### 7.1 Authentication & Account Management

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow a new user to register as either a Provider or a Customer, selecting the role explicitly during sign-up. |
| FR-02 | The system shall require email and password (with confirmation) for registration, and shall validate password strength (minimum 8 characters, at least one number and one letter). |
| FR-03 | The system shall verify a user's email address via a confirmation link before granting full account access. |
| FR-04 | The system shall allow registered users to log in using email and password, issuing a signed JWT session token upon success. |
| FR-05 | The system shall allow users to reset their password via a secure, time-limited email link. |
| FR-06 | The system shall allow Providers and Customers to update their own profile information (name, contact details, profile photo via Cloudinary). |
| FR-07 | The system shall allow users to permanently deactivate their own account, subject to no pending future appointments. |
| FR-08 | The system shall enforce role-based access control so that Provider-only and Customer-only operations are inaccessible to the other role. |

### 7.2 Provider Profile & Service Management

| ID | Requirement |
|---|---|
| FR-09 | The system shall allow a Provider to create and edit a business profile including business name, category, description, address, and contact information. |
| FR-10 | The system shall allow a Provider to upload and manage business/profile images via Cloudinary, with a defined maximum file size and supported formats (JPEG, PNG, WebP). |
| FR-11 | The system shall allow a Provider to create a Service with a name, description, price, duration (in minutes), and category. |
| FR-12 | The system shall allow a Provider to edit or deactivate (soft-delete) an existing Service. A deactivated Service shall no longer be bookable but shall remain visible in historical appointment records. |
| FR-13 | The system shall prevent deletion of a Service that has active future appointments; the Provider must first cancel or reassign those appointments. |

### 7.3 Working Hours & Availability Management

| ID | Requirement |
|---|---|
| FR-14 | The system shall allow a Provider to define recurring weekly working hours per day (start time, end time), including marking specific days as unavailable. |
| FR-15 | The system shall allow a Provider to define date-specific exceptions (e.g., holidays, vacation, one-off closures) that override recurring working hours. |
| FR-16 | The system shall automatically generate bookable time slots based on a Service's duration and the Provider's working hours. |
| FR-17 | The system shall exclude already-booked slots and Provider-defined exceptions from the set of slots presented to Customers. |
| FR-18 | The system shall allow a Provider to configure a minimum booking lead time (e.g., bookings must be made at least X hours in advance) and a maximum advance booking window (e.g., up to N days ahead). |
| FR-19 | The system shall allow a Provider to configure a buffer time between consecutive appointments. |

### 7.4 Service Discovery (Customer)

| ID | Requirement |
|---|---|
| FR-20 | The system shall allow Customers to browse and search Providers by category, name, and location. |
| FR-21 | The system shall allow Customers to view a Provider's public profile, including services offered, working hours, average rating, and reviews. |
| FR-22 | The system shall display only currently available (bookable) slots to Customers, updated in real time as bookings occur. |

### 7.5 Appointment Booking & Lifecycle

| ID | Requirement |
|---|---|
| FR-23 | The system shall allow a Customer to select a Service, a Provider, and an available slot, and initiate a booking request. |
| FR-24 | The system shall hold a selected slot temporarily (e.g., for a configurable reservation window, such as 10 minutes) while the Customer completes payment, preventing double-booking. |
| FR-25 | The system shall require successful payment confirmation before an appointment is marked as **Confirmed**. |
| FR-26 | The system shall release a temporarily held slot back to availability if payment is not completed within the reservation window. |
| FR-27 | The system shall prevent two Customers from booking the same Provider slot concurrently (slot-locking/atomic reservation). |
| FR-28 | The system shall support the following appointment statuses: Pending Payment, Confirmed, Completed, Cancelled by Customer, Cancelled by Provider, No-show. |
| FR-29 | The system shall allow a Customer to cancel a Confirmed appointment, subject to the Provider's cancellation policy (see Business Rules, Section 10). |
| FR-30 | The system shall allow a Customer to request rescheduling of an appointment to another available slot, subject to the Provider's rescheduling policy. |
| FR-31 | The system shall allow a Provider to cancel an appointment (e.g., due to emergency), which shall trigger an automatic refund process and notify the Customer. |
| FR-32 | The system shall allow a Provider to mark a past appointment as Completed or No-show. |
| FR-33 | The system shall automatically transition Confirmed appointments whose scheduled end time has passed (and which were not marked No-show) to Completed status via a scheduled background job. |

### 7.6 Payments

| ID | Requirement |
|---|---|
| FR-34 | The system shall integrate with Stripe Sandbox to process Customer payments at the time of booking. |
| FR-35 | The system shall record a payment transaction (amount, currency, status, Stripe transaction reference) linked to each appointment. |
| FR-36 | The system shall process refunds via Stripe Sandbox when an appointment is cancelled under conditions that qualify for a refund per the cancellation policy. |
| FR-37 | The system shall notify the Customer via email of successful payment, failed payment, and refund events. |
| FR-38 | The system shall never store raw payment card data; all sensitive payment data shall be handled exclusively by Stripe. |

### 7.7 Notifications & Reminders

| ID | Requirement |
|---|---|
| FR-39 | The system shall send a booking confirmation email to the Customer and a new-booking notification email to the Provider immediately upon successful booking, via Nodemailer. |
| FR-40 | The system shall send an automated appointment reminder email to the Customer a configurable interval before the appointment (e.g., 24 hours prior), triggered by a node-cron scheduled job. |
| FR-41 | The system shall send a cancellation notification email to the relevant party whenever an appointment is cancelled or rescheduled. |
| FR-42 | The system shall send a post-appointment email to the Customer requesting a review, triggered after the appointment is marked Completed. |

### 7.8 Reviews & Ratings

| ID | Requirement |
|---|---|
| FR-43 | The system shall allow a Customer to submit a star rating (1–5) and optional written review for a Provider only after the corresponding appointment has been marked Completed. |
| FR-44 | The system shall prevent a Customer from submitting more than one review per completed appointment. |
| FR-45 | The system shall allow a Provider to view all reviews submitted for their business and shall display the calculated average rating on the Provider's public profile. |
| FR-46 | The system shall allow a Provider to post a single public reply to a Customer review. |

### 7.9 Provider Dashboard

| ID | Requirement |
|---|---|
| FR-47 | The system shall display to the Provider a dashboard summarizing: total appointments (by status), upcoming appointments, total revenue, and average rating. |
| FR-48 | The system shall allow the Provider to filter dashboard data by date range. |
| FR-49 | The system shall display a list/calendar view of upcoming and past appointments to the Provider. |

### 7.10 Google Calendar Integration

| ID | Requirement |
|---|---|
| FR-50 | The system shall allow a Provider to connect their Google account via OAuth 2.0 to enable calendar synchronization. |
| FR-51 | The system shall automatically create a corresponding Google Calendar event when an appointment is confirmed, and update/delete the event upon rescheduling/cancellation. |
| FR-52 | The system shall allow a Provider to disconnect their Google Calendar integration at any time. |

---

## 8. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | The system shall return GraphQL query responses for standard operations (e.g., slot lookup, profile fetch) within 2 seconds under normal load (95th percentile). |
| NFR-02 | Scalability | The system architecture shall support horizontal scaling of the API layer to accommodate growth in concurrent Provider and Customer accounts. |
| NFR-03 | Availability | The platform shall target a minimum of 99.5% uptime, excluding scheduled maintenance windows. |
| NFR-04 | Security | All data in transit shall be encrypted using TLS 1.2 or higher. |
| NFR-05 | Security | User passwords shall be stored using a strong, salted one-way hashing algorithm (e.g., bcrypt). |
| NFR-06 | Security | The system shall implement role-based authorization checks at the GraphQL resolver level for every mutation and sensitive query. |
| NFR-07 | Security | The system shall comply with PCI-DSS requirements by delegating all card-data handling to Stripe and never persisting raw card details. |
| NFR-08 | Data Integrity | Slot reservation and booking confirmation shall be implemented as atomic operations to prevent race conditions and double-booking. |
| NFR-09 | Reliability | Scheduled background jobs (reminders, status transitions) shall include retry logic and failure logging to prevent silent job failures. |
| NFR-10 | Usability | The Customer booking flow (search to payment confirmation) shall be completable within 5 user-initiated steps or fewer. |
| NFR-11 | Usability | The application shall be responsive and fully functional on screen widths from 360px (mobile) to 1920px (desktop). |
| NFR-12 | Maintainability | The codebase shall follow a modular structure separating GraphQL schema, resolvers, services, and data-access layers to support independent testing and maintenance. |
| NFR-13 | Auditability | The system shall log all payment, cancellation, and refund events with timestamps and actor identity for audit purposes. |
| NFR-14 | Portability | The backend shall be containerized to allow deployment across compatible cloud environments without code modification. |
| NFR-15 | Data Privacy | The system shall allow users to request export or deletion of their personal data in line with applicable data protection principles. |
| NFR-16 | Localization Readiness | Although multi-language support is out of scope for v1.0, all user-facing text shall be externalized from code (not hard-coded) to support future localization. |

---

## 9. External System Interfaces

### 9.1 Stripe Sandbox (Payments)

- **Purpose:** Process Customer payments and Provider-initiated/cancellation-triggered refunds.
- **Interface Type:** REST API (Stripe SDK), webhook listener for asynchronous payment status events.
- **Data Exchanged:** Payment intent creation, payment confirmation status, refund requests, transaction identifiers.
- **Constraints:** Sandbox/test mode only for this release; no real financial transactions.

### 9.2 Google Calendar API

- **Purpose:** Two-way synchronization of Provider appointments with their personal Google Calendar.
- **Interface Type:** REST API via OAuth 2.0 authorization code flow.
- **Data Exchanged:** Calendar event creation, update, deletion corresponding to appointment lifecycle events.
- **Constraints:** Requires explicit Provider consent and a valid, refreshable OAuth token; integration is optional per Provider.

### 9.3 Cloudinary

- **Purpose:** Storage and delivery of profile images, business photos, and service images.
- **Interface Type:** REST API / SDK upload.
- **Data Exchanged:** Image binary uploads, returned secure URLs and metadata.
- **Constraints:** Enforced maximum file size and allowed formats (JPEG, PNG, WebP).

### 9.4 Nodemailer (SMTP Relay)

- **Purpose:** Delivery of transactional emails (confirmations, reminders, cancellations, review requests, password resets).
- **Interface Type:** SMTP via Nodemailer library, configured against a transactional email provider.
- **Data Exchanged:** Templated email content (HTML/text), recipient address, delivery status.
- **Constraints:** Must support delivery retries and failure logging; bounced/failed deliveries shall be logged for monitoring.

### 9.5 node-cron (Internal Scheduler)

- **Purpose:** Execution of scheduled background jobs: appointment reminders, automatic status transitions (Confirmed → Completed), expired payment-hold slot release, and review-request triggers.
- **Interface Type:** Internal process scheduler (not an external network interface, but documented here as a system-level integration point).
- **Constraints:** Jobs must be idempotent to safely tolerate process restarts or overlapping executions.

---

## 10. Business Rules

| ID | Rule |
|---|---|
| BR-01 | A Customer may hold only one active slot reservation per Provider at a time during the payment window; concurrent reservations for the same slot by different Customers are not permitted. |
| BR-02 | An appointment is only considered Confirmed after successful payment capture; unpaid reservations expire automatically. |
| BR-03 | Cancellations made by a Customer within a Provider-defined cancellation cutoff window (e.g., less than 24 hours before the appointment) shall not be eligible for a refund, unless the Provider manually overrides this. |
| BR-04 | Cancellations made by a Provider shall always trigger a full refund to the Customer regardless of timing. |
| BR-05 | A Customer may only submit a review for an appointment that has reached Completed status, and only once per appointment. |
| BR-06 | A Service cannot be booked outside the Provider's defined working hours and active exception calendar. |
| BR-07 | A Provider cannot delete a Service or deactivate their account while future Confirmed appointments exist against that Service or account. |
| BR-08 | Appointment slot duration is strictly derived from the associated Service's configured duration and cannot be customized per booking. |
| BR-09 | Each Provider account represents a single practitioner/business unit; multi-staff scheduling under one Provider account is not supported in this release. |
| BR-10 | A buffer time, if configured by the Provider, shall be enforced between the end of one appointment and the start of the next when generating available slots. |

---

## 11. Assumptions

- Providers and Customers have reliable internet access and use supported modern browsers.
- Providers are responsible for the accuracy of their service descriptions, pricing, and working hours.
- Stripe Sandbox behavior is representative of production Stripe behavior for the purposes of this release; production payment go-live is a future phase requiring separate compliance review.
- Customers possess a valid email address and have access to it for verification, confirmations, and reminders.
- Time zone handling assumes each Provider operates in a single, consistently configured time zone; multi-time-zone provider operations are not assumed in v1.0.
- Google Calendar integration is an optional convenience feature; core booking functionality does not depend on it.

---

## 12. Constraints

- The backend technology stack is fixed to Node.js, Express, GraphQL, and MongoDB; no alternative stacks will be evaluated for this release.
- The frontend technology stack is fixed to Angular.
- Scheduled/background processing must use node-cron rather than an external job queue/broker for this release.
- Payment processing is constrained to the Stripe Sandbox environment; no live payment processing is in scope.
- The system supports exactly two user roles (Provider, Customer); no administrative role exists in this release.
- The project timeline and budget (as defined by the business stakeholders, outside this document) constrain the phased delivery of features described in Section 3.3 (Out of Scope).

---

## 13. Acceptance Criteria

The Bookify Release 1.0 system shall be considered ready for acceptance when the following conditions are demonstrably satisfied:

1. **Registration & Auth:** Both Provider and Customer roles can register, verify email, log in, and reset passwords successfully, with role-based access enforced across all protected operations (FR-01–FR-08).
2. **Provider Setup:** A Provider can fully configure a business profile, create at least one Service, and define working hours including at least one exception date, with changes correctly reflected in Customer-facing availability (FR-09–FR-19).
3. **Booking Flow:** A Customer can search for a Provider, view real-time available slots, complete a booking, and successfully pay via Stripe Sandbox, resulting in a Confirmed appointment status (FR-20–FR-27, FR-34–FR-38).
4. **Concurrency Safety:** Under simulated concurrent booking attempts for the same slot, only one booking succeeds and the other is correctly rejected or redirected to alternative slots (FR-27, NFR-08).
5. **Lifecycle Management:** Appointments can be cancelled or rescheduled by both roles per the configured business rules, with correct refund behavior and status transitions, including automated transition to Completed and No-show handling (FR-28–FR-33, BR-01–BR-04).
6. **Notifications:** All defined transactional emails (confirmation, reminder, cancellation, review request) are delivered correctly and on schedule via Nodemailer and node-cron jobs (FR-39–FR-42).
7. **Reviews:** A Customer can submit exactly one review per Completed appointment, and the Provider's average rating updates correctly and is visible on their public profile (FR-43–FR-46, BR-05).
8. **Dashboard:** The Provider dashboard accurately reflects appointment counts, revenue, and ratings, filterable by date range (FR-47–FR-49).
9. **Calendar Sync:** A connected Provider's Google Calendar correctly reflects created, updated, and deleted appointments within an acceptable synchronization delay (FR-50–FR-52).
10. **Non-Functional Compliance:** The system meets the defined performance (NFR-01), security (NFR-04–NFR-07), and responsiveness (NFR-11) benchmarks under representative test conditions, verified through dedicated QA and security test cycles.
11. **No Critical/High Defects:** No unresolved critical or high-severity defects remain open against any in-scope functional requirement at the time of sign-off.

Formal sign-off requires written approval from the Product Owner and QA Lead confirming all the above criteria have been verified through test execution and stakeholder review.

---

*End of Document*
