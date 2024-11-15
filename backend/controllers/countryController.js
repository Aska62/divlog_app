import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc Get dive all countries
// @route GET /api/countries
// @access Public
const getAllCountries = asyncHandler(async (req, res) => {
  const countries = await prisma.country.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    }
  });

  if (countries) {
    res.status(200).json(countries);
  } else {
    res.statu(400).send('Failed to fetch countries');
  }
});


export {
  getAllCountries,
}