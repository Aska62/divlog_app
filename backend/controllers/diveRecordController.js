import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get dive record of logged in user
// @route GET /api/diveRecords
// @access Private
const getMyDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to getMyDiveRecord func'
  })
});

// @desc Add new dive record
// @route POST /api/diveRecords
// @access Private
const addDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to addDiveRecord func'
  })
});

// @desc get login user's dive record by id
// @route GET /api/diveRecords/:id
// @access Private
const getMyDiveRecordById = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to getDiveRecord func'
  })
});


// @desc Edit dive record
// @route Put /api/diveRecords/:id
// @access Private
const editDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to editDiveRecord func'
  })
});

// @desc Delete dive record
// @route Delete /api/diveRecords/:id
// @access Private
const deleteDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to deleteDiveRecord func'
  })
});

// @desc Get dive records by user id
// @route GET /api/diveRecords/view/:userId
// @access Public
const getDiveRecordsByUserId = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to getDiveRecordsByUserId func'
  })
});

// @desc Get dive record by dive record id
// @route GET /api/diveRecords/view/:userId/:recordId
// @access Public
const getDiveRecordByIds = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to getDiveRecordsById func'
  })
});

export {
  getMyDiveRecord,
  addDiveRecord,
  editDiveRecord,
  getMyDiveRecordById,
  deleteDiveRecord,
  getDiveRecordsByUserId,
  getDiveRecordByIds,
}