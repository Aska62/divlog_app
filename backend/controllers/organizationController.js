import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get all organizations
// @route GET /api/organizations
// @access Public
const getAllOrganizations = asyncHandler(async (req, res) => {
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: 'asc',
    }
  });

  if (organizations) {
    res.status(200).json(organizations);
  } else {
    res.status(400).send('Failed to fetch organizations');
  }
});


export {
  getAllOrganizations,
}