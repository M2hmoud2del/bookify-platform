# Sequence Diagrams

**Project:** Bookify – Smart Appointment & Business Management Platform
**Document Version:** 1.0
**Date:** June 30, 2026
**Based On:** Bookify SRS v1.0, Software Analysis v1.0, System Design v1.0
**Prepared By:** Software Architecture & Business Analysis Team

All diagrams use Mermaid `sequenceDiagram` syntax with explicit `activate`/`deactivate` lifelines, `alt`/`opt`/`loop` combined fragments, and synchronous/asynchronous message conventions consistent with UML 2.x notation. Participants and flows are kept consistent with the SRS functional requirements, use case specifications, and database/class design previously defined.

---

## 1. User Registration

**Covers:** FR-01, FR-02, FR-03 (UC-01)

```mermaid
sequenceDiagram
    actor U as User (Customer/Provider)
    participant FE as Angular Client
    participant API as GraphQL API
    participant SVC as AuthService
    participant DB as MongoDB (users)
    participant MAIL as Nodemailer

    U->>FE: Fill registration form (email, password, role)
    activate FE
    FE->>API: mutation registerUser(input)
    activate API
    API->>SVC: registerUser(input)
    activate SVC

    SVC->>DB: findOne({ email })
    activate DB
    DB-->>SVC: null (no existing user)
    deactivate DB

    alt Valid input & email not taken
        SVC->>SVC: hashPassword(password)
        SVC->>DB: insertOne(users document)
        activate DB
        DB-->>SVC: insertedUser
        deactivate DB

        SVC->>SVC: generateEmailVerificationToken()
        SVC->>DB: update({ emailVerificationToken })
        activate DB
        DB-->>SVC: ack
        deactivate DB

        SVC-)MAIL: sendVerificationEmail(email, token)
        Note right of MAIL: Async dispatch via SMTP

        SVC-->>API: { success: true, userId }
        API-->>FE: 200 OK { userId }
        FE-->>U: Show "Check your email to verify account"
    else Email already registered
        SVC-->>API: ValidationError("Email already in use")
        API-->>FE: 400 Error
        FE-->>U: Show inline validation error
    else Invalid input (weak password, etc.)
        SVC-->>API: ValidationError(details)
        API-->>FE: 400 Error
        FE-->>U: Show field-level validation errors
    end

    deactivate SVC
    deactivate API
    deactivate FE
```

---

## 2. User Login

**Covers:** FR-04 (UC-02)

```mermaid
sequenceDiagram
    actor U as User (Customer/Provider)
    participant FE as Angular Client
    participant API as GraphQL API
    participant SVC as AuthService
    participant DB as MongoDB (users)

    U->>FE: Enter email & password
    activate FE
    FE->>API: mutation login(email, password)
    activate API
    API->>SVC: login(email, password)
    activate SVC

    SVC->>DB: findOne({ email })
    activate DB
    DB-->>SVC: userDocument
    deactivate DB

    alt User not found
        SVC-->>API: AuthenticationError("Invalid credentials")
        API-->>FE: 401 Error
        FE-->>U: Show "Invalid email or password"
    else User found
        SVC->>SVC: comparePassword(input, userDocument.passwordHash)
        alt Password mismatch
            SVC-->>API: AuthenticationError("Invalid credentials")
            API-->>FE: 401 Error
            FE-->>U: Show "Invalid email or password"
        else Password matches
            alt Email not verified
                SVC-->>API: AuthenticationError("Email not verified")
                API-->>FE: 403 Error
                FE-->>U: Show "Please verify your email"
            else Email verified & account active
                SVC->>SVC: generateJWT(userId, role)
                SVC-->>API: { token, role, userId }
                API-->>FE: 200 OK { token, role }
                FE->>FE: Store JWT in session
                FE-->>U: Redirect to role-based dashboard
            end
        end
    end

    deactivate SVC
    deactivate API
    deactivate FE
```

---

## 3. Book Appointment

**Covers:** FR-23, FR-24, FR-26, FR-27 (UC-09)

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as Angular Client
    participant API as GraphQL API
    participant ASVC as AppointmentService
    participant DB as MongoDB (appointments)
    participant WH as WorkingHoursService

    C->>FE: Select Service + Provider
    activate FE
    FE->>API: query availableSlots(providerId, serviceId, date)
    activate API
    API->>WH: generateAvailableSlots(provider, service, date)
    activate WH
    WH->>DB: find existing appointments for provider/date
    activate DB
    DB-->>WH: bookedSlots[]
    deactivate DB
    WH-->>API: availableSlots[]
    deactivate WH
    API-->>FE: availableSlots[]
    FE-->>C: Display available time slots
    deactivate API

    C->>FE: Select slot & confirm booking request
    FE->>API: mutation requestBooking(providerId, serviceId, slot)
    activate API
    API->>ASVC: reserveSlot(providerId, serviceId, slot, customerId)
    activate ASVC

    ASVC->>DB: findOneAndUpdate (atomic check-and-insert on {providerId, startTime, endTime})
    activate DB
    alt Slot already held/booked
        DB-->>ASVC: null (conflict)
        deactivate DB
        ASVC-->>API: ConflictError("Slot no longer available")
        API-->>FE: 409 Error
        FE-->>C: Show "Slot unavailable, please choose another"
    else Slot successfully locked
        DB-->>ASVC: appointmentDocument (status: pending_payment)
        deactivate DB
        ASVC->>ASVC: setReservationExpiry(+10 minutes)
        ASVC->>DB: update reservationExpiresAt
        activate DB
        DB-->>ASVC: ack
        deactivate DB
        ASVC-->>API: { appointmentId, reservationExpiresAt }
        API-->>FE: 200 OK { appointmentId, expiresAt }
        FE-->>C: Redirect to payment step (see Diagram 4)
    end
    deactivate ASVC
    deactivate API
    deactivate FE
```

---

## 4. Stripe Payment Workflow

**Covers:** FR-25, FR-34–FR-38 (UC-10)

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as Angular Client
    participant API as GraphQL API
    participant PSVC as PaymentService
    participant STRIPE as Stripe Sandbox
    participant DB as MongoDB (payments, appointments)
    participant NSVC as NotificationService

    C->>FE: Enter payment details & submit
    activate FE
    FE->>API: mutation initiatePayment(appointmentId)
    activate API
    API->>PSVC: createPaymentIntent(appointmentId)
    activate PSVC

    PSVC->>DB: findOne(appointments, { _id: appointmentId, status: pending_payment })
    activate DB
    DB-->>PSVC: appointmentDocument
    deactivate DB

    alt Reservation expired
        PSVC-->>API: ExpiredError("Reservation window has expired")
        API-->>FE: 410 Error
        FE-->>C: Show "Booking expired, please rebook"
    else Reservation still valid
        PSVC->>STRIPE: POST /payment_intents (amount, currency)
        activate STRIPE
        STRIPE-->>PSVC: { clientSecret, paymentIntentId }
        deactivate STRIPE
        PSVC->>DB: insertOne(payments, { status: pending, stripePaymentIntentId })
        activate DB
        DB-->>PSVC: paymentDocument
        deactivate DB
        PSVC-->>API: { clientSecret }
        API-->>FE: 200 OK { clientSecret }
        deactivate PSVC

        FE->>STRIPE: confirmCardPayment(clientSecret)
        activate STRIPE
        STRIPE-->>FE: paymentResult (success/failure)
        deactivate STRIPE

        alt Payment succeeded
            FE->>API: mutation confirmPaymentCompletion(paymentIntentId)
            activate API
            API->>PSVC: handlePaymentSuccess(paymentIntentId)
            activate PSVC
            PSVC->>DB: update(payments, { status: succeeded })
            activate DB
            DB-->>PSVC: ack
            deactivate DB
            PSVC->>DB: update(appointments, { status: confirmed, paymentId })
            activate DB
            DB-->>PSVC: ack
            deactivate DB
            PSVC-)NSVC: triggerConfirmationNotifications(appointmentId)
            Note right of NSVC: See Diagram 5
            PSVC-->>API: { success: true }
            API-->>FE: 200 OK
            FE-->>C: Show booking confirmation
            deactivate PSVC
            deactivate API
        else Payment failed/declined
            FE->>API: mutation handlePaymentFailure(paymentIntentId, reason)
            activate API
            API->>PSVC: handlePaymentFailure(paymentIntentId, reason)
            activate PSVC
            PSVC->>DB: update(payments, { status: failed })
            activate DB
            DB-->>PSVC: ack
            deactivate DB
            PSVC-)NSVC: sendPaymentFailedEmail(customerId)
            PSVC-->>API: { success: false, reason }
            API-->>FE: 402 Error
            FE-->>C: Show payment failure, allow retry within window
            deactivate PSVC
            deactivate API
        end
    end
    deactivate FE
```

---

## 5. Appointment Confirmation

**Covers:** FR-25, FR-39 (UC-09 main flow, step 6)

*Triggered immediately following successful payment in Diagram 4. Shown here as an independent, detailed flow for clarity.*

```mermaid
sequenceDiagram
    participant PSVC as PaymentService
    participant ASVC as AppointmentService
    participant DB as MongoDB (appointments)
    participant NSVC as NotificationService
    participant MAIL as Nodemailer
    participant CAL as GoogleCalendarService
    actor C as Customer
    actor P as Provider

    PSVC-)ASVC: confirmAppointment(appointmentId, paymentId)
    activate ASVC
    ASVC->>DB: update(appointments, { status: confirmed, paymentId, updatedAt })
    activate DB
    DB-->>ASVC: updatedAppointment
    deactivate DB

    ASVC-)NSVC: dispatchBookingConfirmation(appointmentId)
    activate NSVC
    NSVC->>DB: insertOne(notifications, { type: booking_confirmation, recipient: customer })
    activate DB
    DB-->>NSVC: ack
    deactivate DB
    NSVC-)MAIL: sendEmail(customerEmail, confirmationTemplate)
    MAIL-->>C: Booking confirmation email

    NSVC->>DB: insertOne(notifications, { type: new_booking_alert, recipient: provider })
    activate DB
    DB-->>NSVC: ack
    deactivate DB
    NSVC-)MAIL: sendEmail(providerEmail, newBookingTemplate)
    MAIL-->>P: New booking alert email
    deactivate NSVC

    opt Provider has connected Google Calendar
        ASVC-)CAL: createCalendarEvent(appointmentId)
        Note right of CAL: See Diagram 6
    end

    deactivate ASVC
```

---

## 6. Google Calendar Synchronization

**Covers:** FR-50, FR-51, FR-52 (UC-18)

```mermaid
sequenceDiagram
    actor P as Provider
    participant FE as Angular Client
    participant API as GraphQL API
    participant CSVC as GoogleCalendarService
    participant GOOG as Google Calendar API
    participant DB as MongoDB (providers, appointments)

    rect rgb(245, 245, 245)
    Note over P, DB: Connection Flow (one-time setup)
    P->>FE: Click "Connect Google Calendar"
    activate FE
    FE->>GOOG: Redirect to OAuth 2.0 consent screen
    activate GOOG
    P->>GOOG: Grant calendar permissions
    GOOG-->>FE: Redirect with authorization code
    deactivate GOOG
    FE->>API: mutation connectGoogleCalendar(authCode)
    activate API
    API->>CSVC: exchangeAuthCode(authCode)
    activate CSVC
    CSVC->>GOOG: POST /token (exchange code)
    activate GOOG
    GOOG-->>CSVC: { accessToken, refreshToken, expiresIn }
    deactivate GOOG
    CSVC->>DB: update(providers, { googleCalendar: { isConnected: true, tokens } })
    activate DB
    DB-->>CSVC: ack
    deactivate DB
    CSVC-->>API: { connected: true }
    API-->>FE: 200 OK
    FE-->>P: Show "Google Calendar connected"
    deactivate CSVC
    deactivate API
    deactivate FE
    end

    rect rgb(245, 245, 245)
    Note over CSVC, GOOG: Event Sync Flow (triggered on appointment lifecycle events)
    CSVC->>DB: findOne(providers, { _id: providerId })
    activate CSVC
    activate DB
    DB-->>CSVC: providerDocument { googleCalendar tokens }
    deactivate DB

    alt Provider not connected
        CSVC-->>CSVC: skip sync
    else Provider connected
        alt Access token expired
            CSVC->>GOOG: POST /token (refresh_token grant)
            activate GOOG
            GOOG-->>CSVC: { newAccessToken }
            deactivate GOOG
            CSVC->>DB: update(providers, { googleCalendar.accessToken })
            activate DB
            DB-->>CSVC: ack
            deactivate DB
        end

        alt Appointment Confirmed (new)
            CSVC->>GOOG: POST /calendars/events (insert)
            activate GOOG
            GOOG-->>CSVC: { eventId }
            deactivate GOOG
            CSVC->>DB: update(appointments, { googleCalendarEventId: eventId })
            activate DB
            DB-->>CSVC: ack
            deactivate DB
        else Appointment Rescheduled
            CSVC->>GOOG: PATCH /calendars/events/{eventId} (update)
            activate GOOG
            GOOG-->>CSVC: ack
            deactivate GOOG
        else Appointment Cancelled
            CSVC->>GOOG: DELETE /calendars/events/{eventId}
            activate GOOG
            GOOG-->>CSVC: ack
            deactivate GOOG
        end
    end
    deactivate CSVC
    end

    rect rgb(245, 245, 245)
    Note over P, DB: Disconnection Flow
    P->>FE: Click "Disconnect Google Calendar"
    activate FE
    FE->>API: mutation disconnectGoogleCalendar()
    activate API
    API->>CSVC: revokeTokens(providerId)
    activate CSVC
    CSVC->>DB: update(providers, { googleCalendar: { isConnected: false, tokens: null } })
    activate DB
    DB-->>CSVC: ack
    deactivate DB
    CSVC-->>API: { disconnected: true }
    API-->>FE: 200 OK
    FE-->>P: Show "Google Calendar disconnected"
    deactivate CSVC
    deactivate API
    deactivate FE
    end
```

---

## 7. Reminder Scheduler

**Covers:** FR-40, FR-33 (background job orchestration via node-cron; NFR-09)

```mermaid
sequenceDiagram
    participant CRON as node-cron Scheduler
    participant JOB as ReminderJob
    participant DB as MongoDB (appointments)
    participant NSVC as NotificationService
    participant MAIL as Nodemailer
    actor C as Customer

    loop Every 15 minutes (scheduled interval)
        CRON->>JOB: execute()
        activate JOB
        JOB->>DB: find(appointments, { status: confirmed, startTime: within reminderWindow, reminderSent: false })
        activate DB
        DB-->>JOB: dueAppointments[]
        deactivate DB

        alt No appointments due
            JOB->>JOB: log("No reminders due this cycle")
        else Appointments due for reminder
            loop For each due appointment
                JOB->>NSVC: sendReminder(appointmentId)
                activate NSVC
                NSVC->>DB: insertOne(notifications, { type: reminder, status: pending })
                activate DB
                DB-->>NSVC: ack
                deactivate DB
                NSVC-)MAIL: sendEmail(customerEmail, reminderTemplate)
                alt Email dispatched successfully
                    MAIL-->>C: Appointment reminder email
                    NSVC->>DB: update(notifications, { status: sent, sentAt })
                    activate DB
                    DB-->>NSVC: ack
                    deactivate DB
                    NSVC->>DB: update(appointments, { reminderSent: true })
                    activate DB
                    DB-->>NSVC: ack
                    deactivate DB
                else Email delivery failed
                    NSVC->>DB: update(notifications, { status: failed, errorMessage })
                    activate DB
                    DB-->>NSVC: ack
                    deactivate DB
                    NSVC->>NSVC: scheduleRetry()
                end
                deactivate NSVC
            end
        end
        deactivate JOB
    end

    Note over CRON, DB: A separate node-cron job (StatusTransitionJob) independently<br/>transitions Confirmed appointments past their endTime to Completed (FR-33),<br/>and expired pending_payment holds back to released slots (FR-26).
```

---

## 8. Review Submission

**Covers:** FR-43, FR-44, FR-45 (UC-15)

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as Angular Client
    participant API as GraphQL API
    participant RSVC as ReviewService
    participant DB as MongoDB (appointments, reviews, providers)

    C->>FE: Open "Leave a Review" for completed appointment
    activate FE
    FE->>API: mutation submitReview(appointmentId, rating, comment)
    activate API
    API->>RSVC: submitReview(appointmentId, customerId, rating, comment)
    activate RSVC

    RSVC->>DB: findOne(appointments, { _id: appointmentId, customerId, status: completed })
    activate DB
    DB-->>RSVC: appointmentDocument
    deactivate DB

    alt Appointment not found or not Completed
        RSVC-->>API: ValidationError("Appointment not eligible for review")
        API-->>FE: 400 Error
        FE-->>C: Show "Review unavailable until appointment is completed"
    else Appointment eligible
        RSVC->>DB: findOne(reviews, { appointmentId })
        activate DB
        DB-->>RSVC: existingReview (nullable)
        deactivate DB

        alt Review already exists
            RSVC-->>API: ConflictError("Review already submitted")
            API-->>FE: 409 Error
            FE-->>C: Show "You already reviewed this appointment"
        else No existing review
            RSVC->>DB: insertOne(reviews, { appointmentId, customerId, providerId, rating, comment })
            activate DB
            DB-->>RSVC: reviewDocument
            deactivate DB

            RSVC->>DB: find(reviews, { providerId })
            activate DB
            DB-->>RSVC: allProviderReviews[]
            deactivate DB
            RSVC->>RSVC: recalculateAverageRating(allProviderReviews)
            RSVC->>DB: update(providers, { averageRating, reviewCount })
            activate DB
            DB-->>RSVC: ack
            deactivate DB

            RSVC-->>API: { success: true, reviewId }
            API-->>FE: 200 OK
            FE-->>C: Show "Thank you for your review"
        end
    end

    deactivate RSVC
    deactivate API
    deactivate FE
```

---

*End of Document*
