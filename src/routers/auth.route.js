import express from "express";
import {
  googleLogin,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/auth/google", googleLogin);
authRouter.post("/auth/refresh", refreshToken);
authRouter.post("/auth/logout", logout);

export { authRouter };
