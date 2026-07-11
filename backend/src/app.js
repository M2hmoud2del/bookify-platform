import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "./integrations/OAuth/google/passport.js";

import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import providerRoutes from "./modules/provider/provider.routes.js";
import providersRoutes from "./modules/provider/providers.routes.js";
import serviceRoutes from "./modules/service/service.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";
import workingHoursRoutes from "./modules/workingHours/workingHours.routes.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
import appointmentRoutes from "./modules/appointment/appointment.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import paymentWebhookRoutes from "./modules/payment/payment.webhook.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200"
  })
);

app.use(morgan("dev"));

app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }), paymentWebhookRoutes);
app.use(express.json({ limit: "10kb" }));
app.use(passport.initialize());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/auth", authRoutes); // Keep for backwards compatibility / OAuth redirects
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/providers", providersRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/working-hours", workingHoursRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
