import express from "express";
import { signup, signin, updateUsername, updatePassword } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/update-username", authenticate, updateUsername);
router.put("/update-password", authenticate, updatePassword);

export default router;
