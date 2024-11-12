import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();
const saltRounds = 10;

const emailRegex = /^[a-zA-Z0-9_.±]+@+[a-zA-Z0-9-]+\.+[a-zA-Z0-9-.]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12,}$/;

// Validator
const UserValidator = z.object({
  divlog_name  : z.string().max(20),
  license_name : z.string().max(75),
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
  });

  if (user) {
    res.status(200).json({
      id           : user.id,
      divlog_name  : user.divlog_name,
      license_name : user.license_name,
      email        : user.email,
      certification: user.certification,
      cert_org_id  : user.cert_org_id,
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

  if (user) {
    // Create validator
    const updateProfileValidator = UserValidator.partial();

    // Validate
    const validated = updateProfileValidator.safeParse(req.body);

    if (validated.success) {
      try {
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id
          },
          data: validated.data
        });

        res.status(200).json({
          id           : updatedUser.id,
          divlog_name  : updatedUser.divlog_name,
          license_name : updatedUser.license_name,
          email        : updatedUser.email,
          certification: updatedUser.certification,
          cert_org_id  : updatedUser.cert_org_id,
        });
      } catch (error) {
        res.status(500).send({
          message: 'Failed to update user info'
        });
      }
    } else {
      res.status(500).send({
        message: 'Invalid data'
      });
    }
  } else {
    res.status(400).send({
      message: 'The user does not exist'
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
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id
    },
    select: {
      id: true,
      divlog_name  : true,
      license_name : true,
      certification: true,
      cert_org_id  : true,
    },
  });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).send({
      message: 'Failed to find the user'
    });
  }
}

// @desc Get user by name
// @route PUT /api/users/find/name
// @access Public
const getUsersByName = async(req, res) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          divlog_name: {
            startsWith: `_${req.params.name}`,
          }
        },
        {
          divlog_name: {
            endsWith: `${req.params.name}_`,
          }
        }
      ]
    },
    select: {
      id: true,
      divlog_name  : true,
      license_name : true,
      certification: true,
      cert_org_id  : true,
    },
    orderBy: {
      divlog_name: 'asc'
    }
  });

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(400).send({
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
  getUsersByName,
  getLoginUser,
  deleteUser,
}