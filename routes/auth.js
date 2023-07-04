import express from "express";
import {signup,signin,forgotPassword,resetPassword} from "../controllers/auth.js"

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/forget-password",forgotPassword)
router.post("/reset-password/:id/:token", resetPassword);

export default router;
