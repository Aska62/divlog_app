import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import combineDateTime from '../../utils/dateTime/combineDateTime.js';
import asyncHandler from "../../middleware/asyncHandler.js";

const prisma = new PrismaClient();

const DivePlanValidator = z.object({
  user_id             : z.string(),
  date                : z.date(),
  location            : z.string().nullish(),
  country_id          : z.number().int().nullish(),
  purpose_id          : z.number().int().nullish(),
  course              : z.string().nullish(),
  max_depth           : z.number().nullish(),
  start_time          : z.date().nullish(),
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
  is_plan             : z.boolean(true),
})

// @desc Get dive plan of logged in user
// @route GET /api/divePlans
// @access Private
const getMyDivePlans = asyncHandler(async (req, res) => {
  const divePlans = await prisma.diveRecord.findMany({
    where: {
      user_id: req.user.id,
      is_plan: true
    },
    include: {
      weather: false,
      surface_temperature: false,
      water_temperature: false,
      visibility: false,
      end_time: false,
      tankpressure_start: false,
      tankpressure_end: false,
      is_draft: false,
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

  if (divePlans) {
    res.status(200).json(divePlans);
  } else {
    res.status(400).send('Failed to find dive plans');
  }
});

// @desc Create dive plan of logged in user
// @route POST /api/divePlans
// @access Private
const addMyDivePlan = asyncHandler(async (req, res) => {
  const {
    date,
    location,
    country_id,
    purpose_id,
    course,
    max_depth,
    start_time,
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
  } = req.body;

  // If the date is updated, adjust the date of start_time
  const updatedStartTime = start_time ?
    combineDateTime(date, start_time)
    : null;

  const NewDivePlanValidator = DivePlanValidator.omit({
    log_no: true,
  })

  const validated = NewDivePlanValidator.safeParse({
    user_id: req.user.id,
    date: new Date(date),
    location,
    country_id: country_id && Number(country_id),
    purpose_id: purpose_id && Number(purpose_id),
    course,
    max_depth: max_depth && Number(max_depth),
    start_time: updatedStartTime || start_time,
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
    is_plan: true,
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
    const newDivePlan = await prisma.diveRecord.create({
      data: validated.data,
    });

    res.status(201).json(newDivePlan);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error.message
    });
  }
});

// @desc Get dive plan of logged in user by id
// @route GET /api/divePlans/:id
// @access Private
const getMyDivePlanById = asyncHandler(async (req, res) => {
  try {
    const divePlan = await prisma.diveRecord.findUnique({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        is_plan: true,
      },
      include: {
        log_no: false,
        weather: false,
        surface_temperature: false,
        water_temperature: false,
        visibility: false,
        end_time: false,
        tankpressure_start: false,
        tankpressure_end: false,
        buddy_ref: false,
        supervisor_ref: false,
        dive_center_id: false,
        is_plan: false,
        is_draft: false,
        country: {
          select: {
            id: true,
            name: true,
          },
        },
        purpose: {
          select: {
            id: true,
            name: true,
          },
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

    res.status(200).json(divePlan || {});
  } catch (error) {
    console.log('Error while finding a plan', error);
    res.status(400).send('Failed to find a plan');
  }
});

// @desc Update dive plan of logged in user
// @route PUT /api/divePlans/:id
// @access Private
const updateMyDivePlan = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Check if the log exists
  const log = await prisma.diveRecord.findUnique({ where: { id }});
  if (!log) {
    res.status(500).send({
      message: 'The dive record of given id does not exit',
    });
    return;
  }

  const {
    date,
    location,
    country_id,
    purpose_id,
    course,
    max_depth,
    start_time,
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
  } = req.body;

  // If the date is updated, adjust the date of start_time
  const updatedStartTime = date !== log.date &&
      start_time ? combineDateTime(date, start_time) :
      log.start_time ? combineDateTime(date, log.start_time) :
      null

  const validated = DivePlanValidator.safeParse({
    user_id: req.user.id,
    date: new Date(date),
    location,
    country_id: country_id && Number(country_id),
    purpose_id: purpose_id && Number(purpose_id),
    course,
    max_depth: max_depth && Number(max_depth),
    start_time: updatedStartTime || start_time,
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
    is_plan: true,
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
    const updatedDivePlan = await prisma.diveRecord.update({
      where: {
        id,
      },
      data: validated.data,
    });

    res.status(201).json(updatedDivePlan);
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error.message
    });
  }
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
  addMyDivePlan,
  getMyDivePlanById,
  updateMyDivePlan,
  deleteMyDivePlanById,
  saveMyDivePlanAsLog,
  cancelSharingMyDivePlan,
  shareMyDivePlan,
  getDivePlanById,
  copyDivePlanById,
}