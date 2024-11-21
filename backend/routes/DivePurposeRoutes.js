import express from "express";
import {
  getAllPurposes
} from '../controllers/divePurposeController.js';

const router = express.Router();

router.route('/').get(getAllPurposes);

export default router;