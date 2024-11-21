import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get dive centers by name
// @route PUT /api/diveCenters/find/:name
// @access Public
const getDiveCentersByName = async(req, res) => {
  console.log('getDiveCentersByName func')
  const diveCenters = await prisma.diveCenter.findMany({
    where: {
      name: {
        contains: `${req.params.name}`,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name : true,
      country: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  if (diveCenters) {
    res.status(200).json(diveCenters);
  } else {
    res.status(400).send({
      message: 'Failed to find dive centers'
    });
  }
}

export {
  getDiveCentersByName,
}