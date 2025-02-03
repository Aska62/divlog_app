import { PrismaClient } from '@prisma/client';
import { record, z } from 'zod';
import asyncHandler from "../../middleware/asyncHandler.js";

const prisma = new PrismaClient();

const DiveRecordValidator = z.object({
  user_id             : z.string(),
  log_no              : z.number().int(),
  date                : z.date(),
  location            : z.string().nullish(),
  country_id          : z.number().int().nullish(),
  purpose_id          : z.number().int().nullish(),
  course              : z.string().nullish(),
  weather             : z.string().nullish(),
  surface_temperature : z.number().nullish(),
  water_temperature   : z.number().nullish(),
  max_depth           : z.number().nullish(),
  visibility          : z.number().nullish(),
  start_time          : z.date().nullish(),
  end_time            : z.date().nullish(),
  tankpressure_start  : z.number().nullish(),
  tankpressure_end    : z.number().nullish(),
  added_weight        : z.number().nullish(),
  suit                : z.string().nullish(),
  gears               : z.string().nullish(),
  buddy_str           : z.string().nullish(),
  buddy_ref           : z.string().nullish(),
  supervisor_str      : z.string().nullish(),
  supervisor_ref      : z.string().nullish(),
  dive_center_str     : z.string().nullish(),
  dive_center_id      : z.string().nullish(),
  notes               : z.string().nullish(),
  is_draft            : z.boolean(),
})

// @desc Get dive record of logged in user
// @route GET /api/diveRecords
// @access Private
const getMyDiveRecords = asyncHandler(async (req, res) => {
  const diveRecords = await prisma.diveRecord.findMany({
    where: {
      user_id: req.user.id,
      is_plan: false
    },
    include: {
      country: {
        select: { name: true },
      },
      purpose: {
        select: { name: true },
      },
      buddy: {
        select: {
          id: true,
          divlog_name: true,
        },
      },
      supervisor: {
        select: {
          id: true,
          divlog_name: true,
        }
      },
      dive_center: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  if (diveRecords) {
    res.status(200).json(diveRecords);
  } else {
    res.status(400).send('Failed to find dive records');
  }
});

// @desc Get total number of dives of logged in user
// @route GET /api/diveRecords/count
// @access Private
const getMyDiveRecordCount = asyncHandler(async (req, res) => {
  const diverInfo = await prisma.diverInfo.findUnique({
    where: {
      user_id: req.user.id,
    },
  });
  const noRecordDiveCount = diverInfo?.norecord_dive_count || 0;

  try {
    const recordDiveCount = await prisma.diveRecord.aggregate({
      where: {
        user_id: req.user.id,
        is_draft: false, // exclude draft
        is_plan: false, // exclude plan
      },
      _count: { id: true }
    });

    res.status(200).json({
      total: noRecordDiveCount + recordDiveCount._count.id,
      recorded: recordDiveCount._count.id,
      withoutRecord: noRecordDiveCount,
    });

  } catch (error) {
    console.log('Error:', error);
    res.status(400).send('Failed to get record count');
  }
});

// @desc Get dive record of logged in user
// @route GET /api/diveRecords/last
// @access Private
const getLastDiveRecord = asyncHandler(async (req, res) => {
  try {
    const diveRecord = await prisma.diveRecord.findFirst({
      where: {
        user_id: req.user.id,
        is_draft: false,
        is_plan: false,
      },
      select: {
        id: true,
        user_id: true,
        log_no: true,
        date: true,
        location: true,
        country_id: true,
        is_draft: true,
        country: {
          select: {
            name: true,
          }
        },
      },
      orderBy: {
        start_time: 'desc',
      }
    });

    if (diveRecord) {
      res.status(200).json(diveRecord);
    } else {
      res.status(200).send('No record yet');
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(400).send('Error while fetching data');
  }
});

// @desc Get dive records by query
// @route GET /api/diveRecords/search
// @access Private
const searchMyDiveRecords = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo, logNoFrom, logNoTo, country, status } = req.query;

  const where = {
    user_id: req.user.id,
    is_plan: false,
  };

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

  try {
    const diveRecords = await prisma.diveRecord.findMany({
      where,
      select: {
        id: true,
        user_id: true,
        log_no: true,
        date: true,
        location: true,
        is_draft: true,
        country: {
          select: { name: true },
        },
      },
      orderBy: {
        log_no: 'desc',
      }
    });

    const recordToReturn = diveRecords ? diveRecords.map((record) => {
      return {
        id      : record.id,
        user_id : record.user_id,
        log_no  : record.log_no,
        date    : record.date,
        location: record.location,
        country : record.country?.name || '',
        is_draft: record.is_draft,
      }
    }) : [];

    res.status(200).json(recordToReturn);
  } catch (error) {
    console.log('Error:', error);
    res.status(400).send('Failed to find dive records');
  }
});

// @desc Add new dive record
// @route POST /api/diveRecords
// @access Private
const addDiveRecord = asyncHandler(async (req, res) => {
  const {
    log_no,
    date,
    location,
    country_id,
    purpose_id,
    course,
    weather,
    surface_temperature,
    water_temperature,
    max_depth,
    visibility,
    start_time,
    end_time,
    tankpressure_start,
    tankpressure_end,
    added_weight,
    suit,
    gears,
    buddy_str,
    buddy_ref,
    supervisor_str,
    supervisor_ref,
    dive_center_str,
    dive_center_id,
    notes,
    is_draft,
  } = req.body;

  const validated = DiveRecordValidator.safeParse({
    user_id: req.user.id,
    log_no: log_no && Number(log_no),
    date: new Date(date),
    location,
    country_id: country_id && Number(country_id),
    purpose_id: purpose_id && Number(purpose_id),
    course,
    weather,
    surface_temperature: surface_temperature && Number(surface_temperature),
    water_temperature: water_temperature && Number(water_temperature),
    max_depth: max_depth && Number(max_depth),
    visibility: visibility && Number(visibility),
    start_time: start_time && new Date(start_time),
    end_time: end_time && new Date(end_time),
    tankpressure_start: tankpressure_start && Number(tankpressure_start),
    tankpressure_end: tankpressure_end && Number(tankpressure_end),
    added_weight: added_weight && Number(added_weight),
    suit,
    gears,
    buddy_str,
    buddy_ref: buddy_ref && buddy_ref.length > 0 ? buddy_ref : null,
    supervisor_str,
    supervisor_ref: supervisor_ref && supervisor_ref.length > 0 ? supervisor_ref : null,
    dive_center_str,
    dive_center_id: dive_center_id && dive_center_id.length > 0 ? dive_center_id : null,
    notes,
    is_draft,
  });

  if (!validated.success) {
    res.status(500).send({
      message: 'Failed in validation',
      error: validated.error.errors.reduce((prev, error) => {
        const newErrVal = {[error.path[0]]: error.message};
        return prev = {...prev, ...newErrVal}
      }, {})
    });
    return;
  }

  // Check if the country exists
  if (validated.data.country_id) {
    const country = await prisma.country.findUnique({
      where: { id: validated.data.country_id }
    });

    if (country) {
      validated.data.country_id = country.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {country_id: 'The country id does not exist'}
      });
      return;
    }
  }

  // Check if the purpose exists
  if (validated.data.purpose_id) {
    const purpose = await prisma.divePurpose.findUnique({
      where: { id: validated.data.purpose_id }
    });

    if (purpose) {
      validated.data.purpose_id = purpose.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {purpose_id: 'The purpose code does not exist'}
      });
      return;
    }
  }

  // Check if the buddy ref is registered user id
  if (validated.data.buddy_ref) {
    const buddyRef = await prisma.user.findUnique({
      where: { id: validated.data.buddy_ref }
    });

    if (buddyRef) {
      validated.data.buddy_ref = buddyRef.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {buddy_ref: 'The buddy does not exist'}
      });
      return;
    }
  }

  // Check if the supervisor ref is registered user id
  if (validated.data.supervisor_ref) {
    const supervisorRef = await prisma.user.findUnique({
      where: { id: validated.data.supervisor_ref }
    });

    if (supervisorRef) {
      validated.data.supervisor_ref = supervisorRef.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {buddy_ref: 'The supervisor does not exist'}
      });
      return;
    }
  }

  // Check if the dive center id is registered dive center id
  if (validated.data.dive_center_id) {
    const diveCenterRef = await prisma.diveCenter.findUnique({
      where: { id: validated.data.dive_center_id }
    });

    if (diveCenterRef) {
      validated.data.dive_center_id = diveCenterRef.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {buddy_ref: 'The dive center does not exist'}
      });
      return;
    }
  }

  try {
    console.log('try adding data')
    const newDiveRecord = await prisma.diveRecord.create({
      data: validated.data,
    });
    res.status(201).json(newDiveRecord);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error.message
    });
  }
});

// @desc get login user's dive record by id
// @route GET /api/diveRecords/:id
// @access Private
const getMyDiveRecordById = asyncHandler(async (req, res) => {
  try {
    const diveRecord = await prisma.diveRecord.findUnique({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        is_plan: false,
      },
      include: {
        country: {
          select: { name: true },
        },
        purpose: {
          select: { name: true },
        },
        buddy: {
          select: {
            id: true,
            divlog_name: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            divlog_name: true,
          }
        },
        dive_center: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });

    res.status(200).json(diveRecord || {});
  } catch (error) {
    console.log('Error while finding record', error);
    res.status(400).send('Failed to find dive record');
  }
});


// @desc Update dive record
// @route Put /api/diveRecords/:id
// @access Private
const updateDiveRecord = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    log_no,
    date,
    location,
    country_id,
    purpose_id,
    course,
    weather,
    surface_temperature,
    water_temperature,
    max_depth,
    visibility,
    start_time,
    end_time,
    tankpressure_start,
    tankpressure_end,
    added_weight,
    suit,
    gears,
    buddy_str,
    buddy_ref,
    supervisor_str,
    supervisor_ref,
    dive_center_str,
    dive_center_id,
    notes,
    is_draft,
  } = req.body;

  const UpdateDiveRecordValidator = DiveRecordValidator.omit({
    user_id: true,
  });

  const validated = UpdateDiveRecordValidator.safeParse({
    log_no: log_no && Number(log_no),
    date: new Date(date),
    location,
    country_id: country_id && Number(country_id),
    purpose_id: purpose_id && Number(purpose_id),
    course,
    weather,
    surface_temperature: surface_temperature && Number(surface_temperature),
    water_temperature: water_temperature && Number(water_temperature),
    max_depth: max_depth && Number(max_depth),
    visibility: visibility && Number(visibility),
    start_time: start_time && new Date(start_time),
    end_time: end_time && new Date(end_time),
    tankpressure_start: tankpressure_start && Number(tankpressure_start),
    tankpressure_end: tankpressure_end && Number(tankpressure_end),
    added_weight: added_weight && Number(added_weight),
    suit,
    gears,
    buddy_str,
    buddy_ref: buddy_ref && buddy_ref.length > 0 ? buddy_ref : null,
    supervisor_str,
    supervisor_ref: supervisor_ref && supervisor_ref.length > 0 ? supervisor_ref : null,
    dive_center_str,
    dive_center_id: dive_center_id && dive_center_id.length > 0 ? dive_center_id : null,
    notes,
    is_draft,
  });

  if (!validated.success) {
    res.status(500).send({
      message: 'Failed in validation',
      error: validated.error.errors.reduce((prev, error) => {
        const newErrVal = {[error.path[0]]: error.message};
        return prev = {...prev, ...newErrVal}
      }, {})
    });
    return;
  }

  // Check if the log exists
  const log = await prisma.diveRecord.findUnique({ where: { id }});
  if (!log) {
    res.status(500).send({
      message: 'The dive record of given id does not exit',
    });
    return;
  }

  // Check if the country exists
  if (validated.data.country_id) {
    const country = await prisma.country.findUnique({
      where: { id: validated.data.country_id }
    });

    if (country) {
      validated.data.country_id = country.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {country_id: 'The country id does not exist'}
      });
      return;
    }
  }

  // Check if the purpose exists
  if (validated.data.purpose_id) {
    const purpose = await prisma.divePurpose.findUnique({
      where: { id: validated.data.purpose_id }
    });

    if (purpose) {
      validated.data.purpose_id = purpose.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {purpose_id: 'The purpose id does not exist'}
      });
      return;
    }
  }

  // Check if the buddy ref is registered user id
  if (validated.data.buddy_ref) {
    const buddyRef = await prisma.user.findUnique({
      where: { id: validated.data.buddy_ref }
    });

    if (buddyRef) {
      validated.data.buddy_ref = buddyRef.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {buddy_ref: 'The buddy does not exist'}
      });
      return;
    }
  }

  // Check if the supervisor ref is registered user id
  if (validated.data.supervisor_ref) {
    const supervisorRef = await prisma.user.findUnique({
      where: { id: validated.data.supervisor_ref }
    });

    if (supervisorRef) {
      validated.data.supervisor_ref = supervisorRef.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {supervisor_ref: 'The supervisor does not exist'}
      });
      return;
    }
  }

  // Check if the dive center id is registered dive center id
  if (validated.data.dive_center_id) {
    const diveCenterRef = await prisma.diveCenter.findUnique({
      where: { id: validated.data.dive_center_id }
    });

    if (diveCenterRef) {
      validated.data.dive_center_id = diveCenterRef.id;
    } else {
      res.status(500).send({
        message: 'Failed in validation',
        error: {dive_center_id: 'The dive center does not exist'}
      });
      return;
    }
  }

  try {
    const updatedDiveRecord = await prisma.diveRecord.update({
      where: {
        id,
      },
      data: validated.data,
    });

    res.status(201).json(updatedDiveRecord);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error.message
    });
  }
});

// @desc Delete dive record TODO:
// @route Delete /api/diveRecords/:id
// @access Private
const deleteDiveRecord = asyncHandler(async (req, res) => {
  res.status(200).send({
    message: 'Reached to deleteDiveRecord func'
  })
});

// @desc Find buddy's dive records TODO:
// @route GET /api/diveRecords/view/:userId
// @access Private
const searchBuddysDiveRecords = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user.id;
  const {
    dateFrom,
    dateTo,
    logNoFrom,
    logNoTo,
    country,
    isMyBuddyDive,
    isMyInstruction
  } = req.query;

  const where = {
    user_id: req.params.userId,
    is_draft: false,
    is_plan: false,
  };

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
    where.country_id = Number(country);
  }

  if (isMyBuddyDive) {
    where.buddy = {
      id: loggedInUserId,
    };
  }

  if (isMyInstruction) {
    where.supervisor = {
      id: loggedInUserId,
    };
  }

  try {
    const fetchedRecord = await prisma.diveRecord.findMany({
      where,
      select: {
        id: true,
        user_id: true,
        log_no: true,
        date: true,
        location: true,
        country: {
          select: { name: true },
        },
        buddy: {
          where: {
            id: loggedInUserId,
          },
          select: {
            id: true,
          }
        },
        supervisor: {
          where: {
            id: loggedInUserId,
          },
          select: {
            id: true,
          }
        }
      },
      orderBy: {
        log_no: 'desc',
      }
    });
    const record = fetchedRecord? fetchedRecord.map((record) => {
      return {
        id               : record.id,
        user_id          : record.user_id,
        log_no           : record.log_no,
        date             : record.date,
        location         : record.location,
        country          : record.country?.name,
        is_my_buddy_dive : !!record.buddy,
        is_my_instruction: !!record.supervisor,
      }
    }) : {};
    res.status(200).json(record);
  } catch (error) {
    console.log('Error: ', error);
    res.status(400).send('Failed to find dive records');
  }
});

// @desc Get dive record by id
// @route GET /api/diveRecords/view/:userId/:recordId
// @access Private
const getDiveRecordById = asyncHandler(async (req, res) => {
  try {
    const diveRecord = await prisma.diveRecord.findUnique({
      where: {
        id: req.params.recordId,
        user_id: req.params.userId,
        is_plan: false,
      },
      include: {
        country: {
          select: { name: true },
        },
        purpose: {
          select: { name: true },
        },
        owner: {
          select: {
            id: true,
            divlog_name: true,
          }
        },
        buddy: {
          select: {
            id: true,
            divlog_name: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            divlog_name: true,
          }
        },
        dive_center: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });
    res.status(200).json(diveRecord);
  } catch (error) {
    res.status(400).send('Failed to find dive record');
  }
});

export {
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
}