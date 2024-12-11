import express from "express";
import {
  getAllOrganizations
} from '../controllers/organizationController.js';

const router = express.Router();

router.route('/').get(getAllOrganizations);

export default router;