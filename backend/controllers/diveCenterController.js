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
      following_dcs: {
        where: {
          user_id: userId,
        },
        select: {
          id: true,
        }
      }
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

  if (status === '2') {
    conditions.where.following_dcs = {
      some: {
        user_id: userId,
      },
    }
  }

  try {
    const diveCenters = await prisma.diveCenter.findMany(conditions);
    if (diveCenters) {
      res.status(200).json(diveCenters.map((center) => {
        return {
          id          : center.id,
          name        : center.name,
          country     : center.country.name,
          organization: center.organization.name,
          is_following: center.following_dcs.length > 0,
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


// @desc Get dive center by id
// @route PUT /api/diveCenter/:id
// @access Public
const getDiveCenterById = async(req, res) => {
  const userId = req.user.id;

  const diveCenter = await prisma.diveCenter.findUnique({
    where: {
      id: req.params.id,
    },
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
      center_staffs: {
        select: {
          user: {
            select: {
              id: true,
              divlog_name: true,
              license_name: true,
            }
          }
        }
      },
      following_dcs: {
        select: {
          user_id: true,
        }
      }
    }
  });

  if (diveCenter) {
    res.status(200).json({
      id            : diveCenter.id,
      name          : diveCenter.name,
      country       : diveCenter.country.name,
      organization  : diveCenter.organization.name,
      staffs        : diveCenter.center_staffs.map((staff) => staff.user),
      follower_count: diveCenter.following_dcs.length,
      is_following  : !!diveCenter.following_dcs.find((f) => f.user_id === userId),
    });
  } else {
    res.status(400).send('Failed to find dive center info');
  }
}

export {
  getDiveCentersByName,
  findDiveCenters,
  getDiveCenterById,
}