import express from "express";
import {
  getDiverInfoByUserId,
} from '../controllers/diverInfoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getDiverInfoByUserId);

export default router;