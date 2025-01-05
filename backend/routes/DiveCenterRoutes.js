import express from "express";
import {
  getDiveCentersByName,
  findDiveCenters,
  getDiveCenterById,
} from '../controllers/diveCenterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/find').get(protect, findDiveCenters);
router.route('/find/name/:name').get(getDiveCentersByName);
router.route('/:id').get(protect, getDiveCenterById);

export default router;