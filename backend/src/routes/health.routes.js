import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bookify backend is running",
    database: "MongoDB"
  });
});

export default router;
