import express from "express";
import { signup, signin, updateUsername, updatePassword } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
//Update Username (requires password verification)
router.put("/update-username", authenticate, updateUsername);

//Update Password (requires old password + confirmation)
router.put("/update-password", authenticate, updatePassword);

export default router;
