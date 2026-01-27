import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  createMomentController,
  deleteMomentController,
  feedMomentController,
} from "../controllers/moment.controller.js";
import { imageMiddleware } from "../middlewares/image.middleware.js";

const momentRouter = express.Router();

// create moment
momentRouter.post("/moments", isAuth, imageMiddleware, createMomentController);

// get moment feed
momentRouter.get("/moments/feed", isAuth, feedMomentController);
momentRouter.get("/users/:id/moments", isAuth);

// delete moment
momentRouter.delete("/moments/:id", isAuth, deleteMomentController);

export { momentRouter };
