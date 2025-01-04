import express from "express";
import {
  getDiveCentersByName,
  findDiveCenters,
} from '../controllers/diveCenterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/find').get(protect, findDiveCenters)
router.route('/find/name/:name').get(getDiveCentersByName);

export default router;