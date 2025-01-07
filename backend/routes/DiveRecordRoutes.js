import express from 'express';
import {
  getMyDiveRecords,
  getMyDiveRecordCount,
  getLastDiveRecord,
  searchMyDiveRecords,
  addDiveRecord,
  updateDiveRecord,
  getMyDiveRecordById,
  deleteDiveRecord,
  searchBuddysDiveRecords,
  getDiveRecordById,
} from '../controllers/diveRecordController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyDiveRecords).post(protect, addDiveRecord);
router.route('/last').get(protect, getLastDiveRecord);
router.route('/count').get(protect, getMyDiveRecordCount);
router.route('/search').get(protect, searchMyDiveRecords);
router.route('/view/:userId').get(protect, searchBuddysDiveRecords);
router.route('/view/:userId/:recordId').get(getDiveRecordById);
router.route('/:id').get(protect, getMyDiveRecordById).put(protect, updateDiveRecord).delete(protect, deleteDiveRecord);

export default router;