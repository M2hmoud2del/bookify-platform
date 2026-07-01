# Bookify

> **Smart Appointment & Business Management Platform**

Bookify is a modern SaaS platform that enables appointment-based businesses to manage their services, schedules, bookings, payments, and customers in one place.

Designed with the **MEAN Stack** and **GraphQL**, Bookify provides a seamless booking experience for customers while giving service providers powerful tools to manage their business efficiently.

---

## 🚀 Features

### Authentication & Authorization

* JWT Authentication
* Role-Based Access Control (RBAC)
* Secure Password Hashing
* User Registration & Login

### Provider Features

* Manage Profile
* Upload Profile Picture
* Create, Update, Delete Services
* Upload Service Images
* Configure Working Hours
* Manage Appointments
* Accept / Reject Bookings
* Dashboard & Analytics
* View Customer Reviews

### Customer Features

* Browse Providers
* Browse Services
* Search & Filter Services
* Book Appointments
* Online Payments
* Appointment History
* Leave Reviews
* Manage Profile

### Appointment Management

* Real-Time Availability
* Booking Confirmation
* Appointment Status Tracking
* Automatic Completion
* Cancellation Support

### Dashboard

* Today's Appointments
* Upcoming Appointments
* Monthly Revenue
* Average Rating
* Customer Statistics
* Appointment Analytics

---

## 💳 External Integrations

* **Stripe Sandbox** – Secure online payment processing
* **Google Calendar API** – Automatic appointment synchronization
* **Cloudinary** – Image storage and management
* **Nodemailer** – Email notifications and reminders

---

## ⏰ Background Jobs

Using **node-cron**, the system automatically:

* Sends appointment reminder emails
* Marks expired appointments as completed
* Sends review request emails after completed appointments

---

## 🛠 Tech Stack

### Frontend

* Angular
* TypeScript
* Angular Material
* Apollo Angular

### Backend

* Node.js
* Express.js
* GraphQL (Apollo Server)
* JWT Authentication
* Bcrypt

### Database

* MongoDB
* Mongoose

### Integrations

* Stripe
* Google Calendar API
* Cloudinary
* Nodemailer

---

## 👥 User Roles

### Provider

* Manage Services
* Manage Working Hours
* Manage Appointments
* View Dashboard
* View Reviews

### Customer

* Browse Services
* Book Appointments
* Pay Online
* View Appointment History
* Submit Reviews

---

## 📂 Project Structure

```text
bookify/
│
├── frontend/
│
├── backend/
│
├── docs/
│
└── README.md
```

---

## 📋 Booking Workflow

```text
Customer
    │
    ▼
Browse Services
    │
    ▼
Select Provider
    │
    ▼
Choose Date & Time
    │
    ▼
Create Appointment
    │
    ▼
Pending Payment
    │
    ▼
Stripe Checkout
    │
    ▼
Payment Successful
    │
    ▼
Appointment Confirmed
    │
    ▼
Google Calendar Sync
    │
    ▼
Reminder Email
    │
    ▼
Appointment Completed
    │
    ▼
Review Request
```

---

## 🔐 Security

* JWT Authentication
* Role-Based Authorization
* Password Hashing (bcrypt)
* Input Validation
* Secure Environment Variables
* CORS Protection
* Helmet Security Middleware
* NoSQL Injection Prevention
* GraphQL Validation

---

## 📈 Future Enhancements

* Google OAuth
* QR Code Check-in
* SMS Notifications
* Push Notifications
* Multi-language Support
* Provider Availability Calendar
* Advanced Analytics
* Admin Panel

---

## 📚 Documentation

The project includes:

* Software Requirements Specification (SRS)
* Use Case Diagram
* Class Diagram
* Sequence Diagrams
* Activity Diagrams
* ER Diagram
* System Architecture
* GraphQL Schema Design

---

## 📄 License

This project is developed for educational purposes as part of the **NTI MEAN Stack Web Development Summer Training**.

---

## 👨‍💻 Author

**Mahmoud Adel**

Computer Engineering Student | Backend Developer | Cybersecurity Enthusiast

GitHub: https://github.com/M2hmoud2del
