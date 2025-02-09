import express from "express";
import { checkAuth } from "../controllers/authController.js";

const router = express.Router();

router.route('/check').get(checkAuth);

export default router;