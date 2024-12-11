import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get all dive purposes
// @route GET /api/divePurposes
// @access Public
const getAllPurposes = asyncHandler(async (req, res) => {
  const divePurposes = await prisma.divePurpose.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    }
  });

  if (divePurposes) {
    res.status(200).json(divePurposes);
  } else {
    res.status(400).send('Failed to fetch dive purposes');
  }
});


export {
  getAllPurposes,
}