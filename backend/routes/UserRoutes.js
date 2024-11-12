import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getAllUsers,
  getUserById,
  getUsersByName,
  getLoginUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/logout').post(protect, logoutUser);
router.route('/profile').get(protect, getLoginUser).put(protect, updateUser).delete(protect, deleteUser);
router.route('/find/:name').get(getUsersByName);
router.route('/:id').get(getUserById);

export default router;