import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();
const saltRounds = Number(process.env.PASSWORD_SALT_ROUND);

const emailRegex = /^[a-zA-Z0-9_.±]+@+[a-zA-Z0-9-]+\.+[a-zA-Z0-9-.]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12,}$/;

// Validator
const UserValidator = z.object({
  divlog_name  : z.string().max(20),
  license_name : z.string().max(75).nullish(),
  email        : z.string().regex(emailRegex),
  password     : z.string().regex(passwordRegex),
  certification: z.string().max(75).nullish(),
  cert_org_id  : z.number().int().nullish(),
});

// @desc Register user and set token
// @route POST /api/users/regisgter
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { divlog_name, email, password } = req.body;

  if (!divlog_name || !email || !password) {
    res.status(400).json({
      error: 'Please provide all necessary values'
    });
  }

  // Check if users with the same username exists
  const userByName = await prisma.user.findFirst({
    where: {
      divlog_name: divlog_name,
    }
  });

  if (userByName) {
    res.status(400).send({
      error: 'The username is already taken'
    });
    return;
  }

  // Check if users with the same email exists
  const userByEmail = await prisma.user.findFirst({
    where: {
      email: email,
    }
  });

  if (userByEmail) {
    res.status(400).send({
      error: 'The email address is already registered'
    });
    return;
  }

  // Create validator
  const registerUserValidator = UserValidator.pick({
    divlog_name: true,
    email      : true,
    password   : true
  });

  // Validate
  const validated = registerUserValidator.safeParse({
    divlog_name: divlog_name,
    email      : email,
    password   : password
  });

  if (!validated.success) {
    console.log('Validation error: ', validated.error)
    res.status(500).send({
      message: 'Failed in validation'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(validated.data.password, salt);

  try {
    // Store in DB
    const user = await prisma.user.create({
      data: {
        divlog_name: validated.data.divlog_name,
        email      : validated.data.email,
        password   : hashedPassword,
      }
    });

    // Set token as a logged in user
    generateToken(res, user.id);
    sendEmail(email, 'Welcome to DivLog', `Dear ${validated.divlog_name}, You have successfully sign up for DivLog! This email is sent to ${validated.email}`);

    res.status(201).json({
      id: user.id,
      divlog_name  : user.divlog_name,
      license_name : user.license_name,
      certification: user.certification,
      cert_org_id  : user.cert_org_id
    });
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// @desc Login user - auth and set token
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async(req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // If user was found and password matches, set token
  if (user && await bcrypt.compare(password, user.password)) {
    generateToken(res, user.id);

    res.status(200).json({
      id: user.id,
      divlog_name  : user.divlog_name,
      license_name : user.license_name,
      certification: user.certification,
      cert_org_id  : user.cert_org_id
    });
  } else {
    res.status(400).send('Failed to login');
  }
});

// @desc Logout user - clear cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async(req, res) => {
  // Clear jwt from cookie
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getLoginUser = asyncHandler(async(req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        }
      },
      centers: {
        select: {
          dive_center: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      dive_records: {
        select: {
          id: true,
        }
      },
      diver_info: {
        select: {
          norecord_dive_count: true,
        }
      }
    }
  });

  if (user) {
    res.status(200).json({
      id           : user.id,
      divlog_name  : user.divlog_name,
      license_name : user.license_name,
      email        : user.email,
      certification: user.certification,
      cert_org_id  : user.cert_org_id,
      organization : user.organization,
      dive_centers : user.centers.map((center) => center.dive_center),
      log_count    : user.dive_records.length + user.diver_info?.norecord_dive_count,
    });
  } else {
    res.status(400).send('Failed to find user info');
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUser = async(req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(500).send({
      success: false,
      message: '',
      error: 'Failed to find user profile',
    });
    return;
  }

  const {
    divlog_name,
    license_name,
    email,
    certification,
    cert_org_id,
  } = req.body;

  // Create validator
  const updateProfileValidator = UserValidator.omit({
    password   : true
  });

  // Validate
  const validated = updateProfileValidator.safeParse({
    divlog_name,
    license_name,
    email,
    certification,
    cert_org_id: Number(cert_org_id),
  });

  if (!validated.success) {
    res.status(500).send({
      success: false,
      message: 'Failed in validation',
      error: validated.error.errors.reduce((prev, error) => {
        const newErrVal = {[error.path[0]]: error.message};
        return prev = {...prev, ...newErrVal}
      }, {})
    });
    return;
  }

  // Check if the user name is taken by other users
  const sameDivlogName = await prisma.user.findMany({
    where: { divlog_name: validated.data.divlog_name }
  });

  if (sameDivlogName.length > 0 && sameDivlogName.some((u) => u.id !== user.id)) {
    res.status(500).send({
      success: false,
      message: 'Failed in validation',
      error: { divlog_name: 'The user name is taken' }
    });
    return;
  }

  // Check if the email is registered by other users
  const sameEmail = await prisma.user.findMany({
    where: { email: validated.data.email }
  });

  if (sameEmail.length > 0 && sameEmail.some((u) => u.id !== user.id)) {
    res.status(500).send({
      success: false,
      message: 'Failed in validation',
      error: { email: 'The email is registered' }
    });
    return;
  }

  // Check if the cert issuer exists
  if (validated.data.cert_org_id) {
    const certOrg = await prisma.organization.findUnique({
      where: { id: validated.data.cert_org_id }
    });

    if (!certOrg) {
      res.status(500).send({
        success: false,
        message: 'Failed in validation',
        error: { cert_org_id: 'The organization not found' }
      });
      return;
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: validated.data
    });

    res.status(201).send({
      success: true,
      user: {
        id           : updatedUser.id,
        divlog_name  : updatedUser.divlog_name,
        license_name : updatedUser.license_name,
        email        : updatedUser.email,
        certification: updatedUser.certification,
        cert_org_id  : updatedUser.cert_org_id,
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Failed to update user info'
    });
  }
}

// @desc Delete user profile
// @route DELETE /api/users/profile
// @access Private
const deleteUser = async(req, res) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user) {
    try {
      const deleteUser = await prisma.user.delete({
        where: {
          id: user.id
        }
      });

      // Clear jwt from cookie
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });

      res.status(200).send({
        message: 'Successfully deleted the user'
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Error while deleting user'
      })
    }
  } else {
    res.status(400).send({
      message: "User not found"
    })
  }

}

// @desc Get all users
// @route PUT /api/users
// @access Public
const getAllUsers = async(req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      divlog_name  : true,
      license_name : true,
      certification: true,
      cert_org_id  : true,
      created_at   : true,
    },
    orderBy: {
      divlog_name: 'asc'
    }
  });

  if (users) {
    res.status(200).json({ users });
  } else {
    res.status(500).send({
      message: 'Failed to find users'
    });
  }
}

// @desc Get user by id
// @route PUT /api/users/:id
// @access Public
const getUserById = async(req, res) => {
  const { loginUser } = req.query;

  const include = {
    organization: {
      select: {
        id: true,
        name: true,
      }
    },
    centers: {
      select: {
        dive_center: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    },
    dive_records: {
      select: {
        id: true,
      }
    },
    diver_info: {
      select: {
        norecord_dive_count: true,
      }
    }
  }

  if (!!loginUser) {
    include.followers = {
      where: {
        following_user_id: loginUser,
      },
      select: {
        id: true,
      },
    }

    include.following_users = {
      where: {
        user_id: loginUser,
      },
      select: {
        id: true,
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id
    },
    include: include,
  });

  if (user) {
    const norecord_dive_count = user.diver_info?.norecord_dive_count || 0;
    res.status(200).json({
      id           : user.id,
      divlog_name  : user.divlog_name,
      license_name : user.license_name,
      certification: user.certification,
      cert_org_id  : user.cert_org_id,
      organization : user.organization,
      dive_centers : user.centers.map((center) => center.dive_center),
      is_followed  : user.followers?.length > 0,
      is_following : user.following_users?.length > 0,
      log_count    : user.dive_records.length + norecord_dive_count,
    });
  } else {
    res.status(400).send('Failed to find user info');
  }
}

// @desc Find users with keywords and/or follow status
// @route PUT /api/users/find/:status/:keyword
// @access Private
const findUsers = async(req, res) => {
  const { keyword, status } = req.query;
  const userId = req.user.id

  const conditions = {
    where: {
      NOT: {
        id: userId,
      },
    },
    select: {
      id: true,
      divlog_name: true,
      license_name: true,
      followers: { // the logged in user is followed
        where: {
          following_user_id: userId,
        },
        select: {
          id: true,
        }
      },
      following_users: { // the logged in user is following
        where: {
          user_id: userId,
        },
        select: {
          id: true,
        }
      },
    },
    orderBy: [
      {
        license_name: 'asc',
      },
      {
        divlog_name: 'asc'
      }
    ]
  }

  if (keyword && keyword.length > 0) {
    conditions.where.OR = [
      {
        divlog_name: {
          contains: `${keyword}`,
          mode: 'insensitive',
        }
      },
      {
        license_name: {
          contains: `${keyword}`,
          mode: 'insensitive',
        }
      },
    ];
  }

  if (status === '2') {
    // Those who follow the logged in user
    conditions.where.following_users = {
      some: {
        user_id: userId,
      },
    }
  } else if (status === '3') {
   // Those the logged in user is following
    conditions.where.followers = {
      some: {
        following_user_id: userId,
      },
    }
  }

  try {
    const users = await prisma.user.findMany(conditions);
    if (users) {
      res.status(200).json(users.map((user) => {
        return {
          id: user.id,
          divlog_name: user.divlog_name,
          license_name: user.license_name,
          is_following: user.following_users.length > 0,
          is_followed: user.followers.length > 0,
        }
      }));
    } else {
      res.status(200).send({
        message: 'No matching users found'
      });
    }
  } catch (error) {
    console.log('Error', error)
    res.status(400).send({
      message: 'Failed to find users'
    });
  }
}

// @desc Get divlog name by user id
// @route GET /api/users/divlogName/:userId
// @access Public
const getDivlogNameById = async(req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.userId,
      },
      select: {
        divlog_name  : true,
      }
    });

    res.status(200).json({ divlog_name: user.divlog_name });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).send({
      message: 'Failed to find users'
    });
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getAllUsers,
  getUserById,
  getLoginUser,
  deleteUser,
  findUsers,
  getDivlogNameById,
}