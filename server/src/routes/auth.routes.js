import express from "express";
import { login, register, refreshToken, logoutUser } from "../controllers/auth.controller.js";
import { body } from "express-validator";


const router = express.Router();

router.post("/register",
    [
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({ min: 6 })
    ]
    , register);

router.post("/login",
    [
        body("email").isEmail().normalizeEmail(),
        body("password").notEmpty()
    ]
    , login);

router.post("/refresh", refreshToken);

router.post("/logout", logoutUser);

export default router;