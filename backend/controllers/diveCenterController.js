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

// @desc Find dive centers with keywords and/or follow status
// @route PUT /api/diveCenters/find
// @access Private
const findDiveCenters = async(req, res) => {
  console.log('findDiveCenters', req.query);
  const { keyword, country, organization, status } = req.query;
  const userId = req.user.id

  const conditions = {
    where: {},
    select: {
      id: true,
      name: true,
      country: {
        select: {
          name: true,
        },
      },
      organization: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        name: 'asc',
      },
    ]
  }

  if (keyword && keyword.length > 0) {
    conditions.where.name = {
      contains: `${keyword}`,
      mode: 'insensitive',
    }
  }

  if (country) {
    conditions.where.country_id = Number(country);
  }

  if (organization) {
    conditions.where.organization_id = Number(organization);
  }

  // if (status === '2') {
  //   // Those who follow the logged in user
  //   conditions.where.following_users = {
  //     some: {
  //       user_id: userId,
  //     },
  //   }
  // } else if (status === '3') {
  //  // Those the logged in user is following
  //   conditions.where.followers = {
  //     some: {
  //       following_user_id: userId,
  //     },
  //   }
  // }

  try {
    const diveCenters = await prisma.diveCenter.findMany(conditions);
    if (diveCenters) {
      res.status(200).json(diveCenters.map((center) => {
        return {
          id          : center.id,
          name        : center.name,
          country     : center.country.name,
          organization: center.organization.name,
        }
      }));
    } else {
      res.status(200).send({
        message: 'No matching dive centers found'
      });
    }
  } catch (error) {
    console.log('Error', error)
    res.status(400).send({
      message: 'Failed to find dive centers'
    });
  }
}

export {
  getDiveCentersByName,
  findDiveCenters,
}