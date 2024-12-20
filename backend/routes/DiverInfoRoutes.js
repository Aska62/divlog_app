import express from "express";
import {
  getDiverInfoByUserId,
  addDiverInfo,
  updateDiverInfo,
} from '../controllers/diverInfoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getDiverInfoByUserId).post(protect, addDiverInfo).put(protect, updateDiverInfo);

export default router;