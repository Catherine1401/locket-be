import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createMomentController,
  deleteMomentController,
} from "../controllers/moment.controller.js";
import { imageMiddleware } from "../middlewares/image.middleware.js";
import { isMyMoment } from "../middlewares/moment.middleware.js";

const momentRouter = express.Router();

momentRouter.post("/moments", isAuth, imageMiddleware, createMomentController);
momentRouter.get("/moments/feed", isAuth);
momentRouter.get("/users/:id/moments", isAuth);
momentRouter.delete("/moments/:id", isAuth, isMyMoment, deleteMomentController);

export { momentRouter };
