import express from "express";
import {
  getAllCountries,
} from "../controllers/countryController.js";

const router = express.Router();

router.route('/').get(getAllCountries);

export default router;