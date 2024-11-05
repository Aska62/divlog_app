import asyncHandler from "../middleware/asyncHandler.js";

// Register
const registerUser = asyncHandler(async (req, res) => {
  console.log('register user func...')

  // const { divlog_name, email, password } = req.body;

  // Check if users with the same email exists

  // 

  res.status(200).json({
    message: "register func"
  });

});

// TODO: Login
const loginUser = async(req, res) => {
  res.status(200).json({
    message: "loginUser func"
  });
}

// TODO: Logout
const logoutUser = async(req, res) => {
  res.status(200).json({
    message: "logoutUser func"
  });
}

// TODO: Update user
const updateUser = async(req, res) => {
  res.status(200).json({
    message: "updateUser func"
  });
}

// TODO: Delete user
const deleteUser = async(req, res) => {
  res.status(200).json({
    message: "deleteUser func"
  });
}

// TODO: Get all users
const getAllUsers = async(req, res) => {
  res.status(200).json({
    message: "getAllUsers func"
  });
}

// TODO: Get user by id
const getUserById = async(req, res) => {
  res.status(200).json({
    message: "getUserById func"
  });
}

// TODO: Get users by name
const getUsersByName = async(req, res) => {
  res.status(200).json({
    message: "getUsersByName func"
  });
}

// TODO: Get logged in user
const getLoginUser = async(req, res) => {
  res.status(200).json({
    message: "getLoginUser func"
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