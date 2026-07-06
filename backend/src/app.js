import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import providerRoutes from "./modules/provider/provider.routes.js";
import providersRoutes from "./modules/provider/providers.routes.js";
import serviceRoutes from "./modules/service/service.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200"
  })
);

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

app.use("/api/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/providers", providersRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/uploads", uploadRoutes);

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
