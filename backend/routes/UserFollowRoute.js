import express from "express";
import {
  followUser
} from '../controllers/userFollowController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/follow').post(protect, followUser);

export default router;