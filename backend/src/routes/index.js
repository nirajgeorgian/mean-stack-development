import express from "express";
import { userRoutes } from "./user";
import { uploadsRoutes } from "./uploads";

export const getRoutes = () => {
  const router = express.Router();

  router.use("/user", userRoutes());
  router.use("/uploads", uploadsRoutes());

  return router;
};
