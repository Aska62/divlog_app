import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

const DiverInfoValidator = z.object({
  user_id            : z.string(),
  norecord_dive_count: z.number().int(),
  height             : z.number().nullish(),
  weight             : z.number().nullish(),
  measurement_unit   : z.number().int().min(1).max(2),
  languages          : z.array(z.string()),
})

// @desc Get diver info of logged in user
// @route GET /api/diverInfo
// @access Private
const getDiverInfoByUserId = asyncHandler(async (req, res) => {
  const diverInfo = await prisma.diverInfo.findUnique({
    where: {
      user_id: req.user.id
    },
    select: {
      id: true,
      norecord_dive_count: true,
      height: true,
      weight: true,
      shoe: true,
      measurement_unit: true,
      languages: true,
    },
  });

  if (diverInfo) {
    res.status(200).json(diverInfo);
  } else {
    res.status(400).send('No diver info found');
  }
});

// @desc Add new diver info of logged in user
// @route POST /api/diverInfo
// @access Private
const addDiverInfo = asyncHandler(async(req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).send('User id not provided');
    return;
  }

  const diverInfoData = await prisma.diverInfo.findUnique({ where: {user_id: userId}});
  if (diverInfoData) {
    res.status(400).send('Record for the user exists. Cannot add new data');
    return;
  }

  const {
    norecord_dive_count,
    height,
    weight,
    shoe,
    measurement_unit,
    languages
  } = req.body;

  const validated = DiverInfoValidator.safeParse({
    user_id            : userId,
    norecord_dive_count: Number(norecord_dive_count),
    height             : Number(height),
    weight             : Number(weight),
    shoe               : Number(shoe),
    measurement_unit   : Number(measurement_unit),
    languages          : languages || [],
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

  try {
    const newDiverInfo = await prisma.diverInfo.create({
      data: validated.data,
    });
    res.status(201).send({
      success: true,
      diverInfo: newDiverInfo,
    })
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error.message
    });
  }
});

// @desc Update diver info of logged in user
// @route PUT /api/diverInfo
// @access Private
const updateDiverInfo = asyncHandler(async(req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).send('User id not provided');
    return;
  }

  const {
    id,
    norecord_dive_count,
    height,
    weight,
    shoe,
    measurement_unit,
    languages
  } = req.body;

  const diverInfoData = await prisma.diverInfo.findUnique({
    where: {
      id,
      user_id: userId
    }}
  );

  if (!diverInfoData) {
    res.status(400).send('The record does not exist');
    return;
  }

  const validated = DiverInfoValidator.safeParse({
    user_id            : userId,
    norecord_dive_count: Number(norecord_dive_count),
    height             : Number(height),
    weight             : Number(weight),
    shoe               : Number(shoe),
    measurement_unit   : Number(measurement_unit),
    languages          : languages || []
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

  try {
    const updatedDiverInfo = await prisma.diverInfo.update({
      where: { id },
      data: validated.data,
    });
    res.status(201).send({
      success: true,
      diverInfo: updatedDiverInfo,
    })
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: error.message
    })
  }

});


export {
  getDiverInfoByUserId,
  addDiverInfo,
  updateDiverInfo,
}