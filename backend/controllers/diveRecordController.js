import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get dive record of logged in user
// @route GET /api/diveRecords
// @access Private
const getMyDiveRecords = asyncHandler(async (req, res) => {
  const diveRecords = await prisma.diveRecord.findMany({
    where: { user_id: req.user.id }
  });

  if (diveRecords) {
    res.status(200).json(diveRecords);
  } else {
    res.statu(400).send('Failed to find dive records');
  }
});

// @desc Get total number of dives of logged in user
// @route GET /api/diveRecords/count
// @access Private
const getMyDiveRecordCount = asyncHandler(async (req, res) => {
  const noRecordDiveCount = await prisma.diverInfo.findUnique({
    where: { user_id: req.user.id },
    select: { norecord_dive_count: true }
  });

  const recordDiveCount = await prisma.diveRecord.aggregate({
    where: {
      user_id: req.user.id,
      is_draft: false, // exclude draft
    },
    _count: { id: true }
  });

  if (recordDiveCount) {
    res.status(200).json({
      total: noRecordDiveCount.norecord_dive_count + recordDiveCount._count.id,
      wthoutRecord: noRecordDiveCount.norecord_dive_count,
    });
  } else {
    res.status(400).send('Failed to get record count');
  }
});


// @desc Get dive record of logged in user
// @route GET /api/diveRecords
// @access Private
const getLastDiveRecord = asyncHandler(async (req, res) => {
  const diveRecord = await prisma.diveRecord.findFirst({
    where: {
      user_id: req.user.id,
      is_draft: false,
    },
    include: {
      country: {
        select: { name: true },
      },
    },
    orderBy: {
      start_time: 'desc',
    }
  });

  if (diveRecord) {
    res.status(200).json(diveRecord);
  } else {
    res.statu(400).send('Failed to find dive record');
  }
});

// @desc Get dive records by query
// @route GET /api/diveRecords/search
// @access Private
const searchMyDiveRecords = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo, logNoFrom, logNoTo, country, status } = req.query;

  const where = { user_id: req.user.id };

  const dateConditions = (dateFrom && dateTo) ? {
      gte: new Date(dateFrom),
      lte: new Date(dateTo)
    }
    : dateFrom ? { gte: new Date(dateFrom) }
    : dateTo && { lte: new Date(dateTo) }

  if (dateConditions) {
    where.date = dateConditions;
  }

  const logNoConditions = (logNoFrom && logNoTo) ? {
    gte: Number(logNoFrom),
    lte: Number(logNoTo)
  }
  : logNoFrom ? { gte: Number(logNoFrom) }
  : logNoTo && { lte: Number(logNoTo) }

  if (logNoConditions) {
    where.log_no = logNoConditions;
  }

  if (country) {
    where.country_code = Number(country);
  }

  if (Number(status) === 2 ) {
    where.is_draft = false;
  } else if (Number(status) === 3) {
    where.is_draft = true;
  }

  const diveRecords = await prisma.diveRecord.findMany({
    where,
    include: {
      country: {
        select: { name: true },
      },
    },
    orderBy: {
      log_no: 'desc',
    }
  });

  if (diveRecords) {
    res.status(200).json(diveRecords);
  } else {
    res.statu(400).send('Failed to find dive records');
  }
});

// @desc Add new dive record TODO:
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
  const diveRecord = await prisma.diveRecord.findUnique({
    where: {
      id: req.params.id,
      user_id: req.user.id,
    },
    include: {
      country: {
        select: { name: true },
      },
      purpose: {
        select: {name: true},
      }
    },
  });

  if (diveRecord) {
    res.status(200).json(diveRecord);
  } else {
    res.statu(400).send('Failed to find dive record');
  }
});


// @desc Edit dive record TODO:
// @route Put /api/diveRecords/:id
// @access Private
const editDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to editDiveRecord func'
  })
});

// @desc Delete dive record TODO:
// @route Delete /api/diveRecords/:id
// @access Private
const deleteDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to deleteDiveRecord func'
  })
});

// @desc Get dive records by user id TODO:
// @route GET /api/diveRecords/view/:userId
// @access Public
const getDiveRecordsByUserId = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to getDiveRecordsByUserId func'
  })
});

// @desc Get dive record by dive record id TODO:
// @route GET /api/diveRecords/view/:userId/:recordId
// @access Public
const getDiveRecordByIds = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to getDiveRecordsById func'
  })
});

export {
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
}