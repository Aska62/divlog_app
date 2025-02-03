import express from 'express';
import {
  getMyDivePlans,
  addMyDivePlan,
  getMyDivePlanById,
  updateMyDivePlan,
  deleteMyDivePlanById,
  saveMyDivePlanAsLog,
  cancelSharingMyDivePlan,
  shareMyDivePlan,
  getDivePlanById,
  copyDivePlanById,
} from '../../controllers/diveRecord/divePlanController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyDivePlans).post(protect, addMyDivePlan);
router.route('/saveAsLog/:id').put(protect, saveMyDivePlanAsLog);
router.route('/share/cancel/:id').put(protect, cancelSharingMyDivePlan);
router.route('/share/:id').post(protect, shareMyDivePlan);
router.route('/view/:id').get(protect, getDivePlanById);
router.route('/copy/:id').get(protect, copyDivePlanById);
router.route('/:id').get(protect, getMyDivePlanById).put(protect, updateMyDivePlan).delete(protect, deleteMyDivePlanById);

export default router;