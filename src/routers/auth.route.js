import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/auth/google", AuthController.googleLogin);
router.post("/auth/refresh", AuthController.refreshToken);
router.post("/auth/logout", AuthController.logout);

module.exports = router;
