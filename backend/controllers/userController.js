import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();
const saltRounds = 10;

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
    res.status(400).json({
      error: 'The username is already taken'
    });
  }

  // Check if users with the same email exists
  const userByEmail = await prisma.user.findFirst({
    where: {
      email: email,
    }
  });

  if (userByEmail) {
    res.status(400).json({
      error: 'The email address is already registered'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Store in DB
  try {
    const user = await prisma.user.create({
      data: {
        divlog_name,
        email,
        password: hashedPassword,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    req.status(500).json({
      message: error.message
    });
  }
});

// TODO: Login
// @desc Login user - auth and set token
// @route POST /api/users/login
// @access Public
const loginUser = async(req, res) => {
  res.status(200).json({
    message: "loginUser func"
  });
}

// TODO: Logout
// @desc Logout user - clear cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = async(req, res) => {
  res.status(200).json({
    message: "logoutUser func"
  });
}

// TODO: Get logged in user
// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getLoginUser = async(req, res) => {
  res.status(200).json({
    message: "getLoginUser func"
  });
}

// TODO: Update user
// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUser = async(req, res) => {
  res.status(200).json({
    message: "updateUser func"
  });
}

// TODO: Delete user
// @desc Delete user profile
// @route DELETE /api/users/profile
// @access Private
const deleteUser = async(req, res) => {
  res.status(200).json({
    message: "deleteUser func"
  });
}

// TODO: Get all users
// @desc Get all users
// @route PUT /api/users
// @access Public
const getAllUsers = async(req, res) => {
  res.status(200).json({
    message: "getAllUsers func"
  });
}

// TODO: Get user by id
// @desc Get user by id
// @route PUT /api/users/:id
// @access Public
const getUserById = async(req, res) => {
  res.status(200).json({
    message: "getUserById func"
  });
}

// TODO: Get users by name
// @desc Get user by name
// @route PUT /api/users/find/name
// @access Public
const getUsersByName = async(req, res) => {
  res.status(200).json({
    message: "getUsersByName func"
  });
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