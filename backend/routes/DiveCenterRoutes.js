import express from "express";
import {
  getDiveCentersByName,
} from '../controllers/diveCenterController.js';

const router = express.Router();

router.route('/find/:name').get(getDiveCentersByName);

export default router;