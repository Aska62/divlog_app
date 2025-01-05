import express from "express";
import {
  followDiveCenter,
  unfollowDiveCenter,
} from '../controllers/diveCenterFollowController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/follow').post(protect, followDiveCenter);
router.route('/unfollow').delete(protect, unfollowDiveCenter);

export default router;