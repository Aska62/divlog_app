import express from "express";
import {
  followUser,
  unfollowUser
} from '../controllers/userFollowController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/follow').post(protect, followUser);
router.route('/unfollow').post(protect, unfollowUser);

export default router;