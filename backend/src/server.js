import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import { startScheduler } from "./scheduler/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    startScheduler();

    app.listen(PORT, () => {
      console.log(`Bookify backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
