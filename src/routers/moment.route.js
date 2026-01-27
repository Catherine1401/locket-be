import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createMomentController,
  deleteMomentController,
  feedMomentController,
  gridMomentController,
} from "../controllers/moment.controller.js";
import { imageMiddleware } from "../middlewares/image.middleware.js";

const momentRouter = express.Router();

// create moment
momentRouter.post("/moments", isAuth, imageMiddleware, createMomentController);

// get moments feed
momentRouter.get("/moments/feed", isAuth, feedMomentController);

// get moments grid
momentRouter.get("/moments/grid", isAuth, gridMomentController);

// get moments feed by user
momentRouter.get("/users/:id/moments/feed", isAuth, );

// delete moment
momentRouter.delete("/moments/:id", isAuth, deleteMomentController);

export { momentRouter };
