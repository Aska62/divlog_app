import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

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


export {
  getDiverInfoByUserId,
}