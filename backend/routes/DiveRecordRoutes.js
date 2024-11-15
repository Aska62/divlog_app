import express from 'express';
import {
  getMyDiveRecords,
  getMyDiveRecordCount,
  getLastDiveRecord,
  searchMyDiveRecords,
  addDiveRecord,
  editDiveRecord,
  getMyDiveRecordById,
  deleteDiveRecord,
  getDiveRecordsByUserId,
  getDiveRecordByIds,
} from '../controllers/diveRecordController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyDiveRecords).post(protect, addDiveRecord);
router.route('/last').get(protect, getLastDiveRecord);
router.route('/count').get(protect, getMyDiveRecordCount);
router.route('/search').get(protect, searchMyDiveRecords);
router.route('/view/:userId').get(getDiveRecordsByUserId);
router.route('/view/:userId/:recordId').get(getDiveRecordByIds);
router.route('/:id').get(protect, getMyDiveRecordById).put(protect, editDiveRecord).delete(protect, deleteDiveRecord);

export default router;