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

const router = express.Router();

router.get('/', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(getLoginUser).put(updateUser).delete(deleteUser);
router.get('/find/:name', getUsersByName);
router.get('/:id', getUserById);

export default router;