import { PrismaClient } from '@prisma/client';
import { record, z } from 'zod';
import asyncHandler from "../../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get dive plan of logged in user
// @route GET /api/divePlans
// @access Private
const getMyDivePlans = asyncHandler(async (req, res) => {
  console.log('getMyDivePlans func');
});

// @desc Create dive plan of logged in user
// @route POST /api/divePlans
// @access Private
const addMyDiveRecords = asyncHandler(async (req, res) => {
  console.log('addMyDiveRecords func');
});

// @desc Get dive plan of logged in user by id
// @route GET /api/divePlans/:id
// @access Private
const getMyDivePlanById = asyncHandler(async (req, res) => {
  console.log('getMyDivePlanById func');
});

// @desc Update dive plan of logged in user
// @route PUT /api/divePlans/:id
// @access Private
const updateMyDivePlan = asyncHandler(async (req, res) => {
  console.log('updateMyDivePlan func');
});

// @desc Delete dive plan of logged in user
// @route DELETE /api/divePlans/:id
// @access Private
const deleteMyDivePlanById = asyncHandler(async (req, res) => {
  console.log('deleteMyDivePlanById func');
});

// @desc Save dive plan of logged in user as log
// @route PUT /api/divePlans/saveAsLog/:id
// @access Private
const saveMyDivePlanAsLog = asyncHandler(async (req, res) => {
  console.log('saveMyDivePlanAsLog func');
});

// @desc Cancel sharing dive plan with another user
// @route PUT /api/divePlans/share/cancel/:id
// @access Private
const cancelSharingMyDivePlan = asyncHandler(async (req, res) => {
  console.log('cancelSharingMyDivePlan func');
});

// @desc Share dive plan with another user
// @route POST /api/divePlans/share/:id
// @access Private
const shareMyDivePlan = asyncHandler(async (req, res) => {
  console.log('shareMyDivePlan func');
});

// @desc View dive plan by id
// @route GET /api/divePlans/view/:id
// @access Private
const getDivePlanById = asyncHandler(async (req, res) => {
  console.log('getDivePlanById func');
});

// @desc Copy dive plan by id
// @route POST /api/divePlans/copy/:id
// @access Private
const copyDivePlanById = asyncHandler(async (req, res) => {
  console.log('copyDivePlanById func');
});

export {
  getMyDivePlans,
  addMyDiveRecords,
  getMyDivePlanById,
  updateMyDivePlan,
  deleteMyDivePlanById,
  saveMyDivePlanAsLog,
  cancelSharingMyDivePlan,
  shareMyDivePlan,
  getDivePlanById,
  copyDivePlanById,
}