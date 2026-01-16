import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { createMomentController } from "../controllers/moment.controller.js";
import { imageMiddleware } from "../middlewares/image.middleware.js";

const momentRouter = express.Router();

momentRouter.post("/moments", isAuth, imageMiddleware, createMomentController);
momentRouter.get("/moments/feed", isAuth);
momentRouter.get("/uers/:id/moments", isAuth);
momentRouter.delete("/moments/:id", isAuth);

export { momentRouter };
