import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200"
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.use("/api/health", healthRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Bookify backend listening on port ${PORT}`);
  });
};

startServer();
