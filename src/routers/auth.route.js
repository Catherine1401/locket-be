const express = require("express");
const router = express.Router();
const {
  googleLogin,
  refreshToken,
  logout,
} = require("../controllers/auth.controller");

router.post("/auth/google", googleLogin);
router.post("/auth/refresh", refreshToken);
router.post("/auth/logout", logout);

module.exports = router;
