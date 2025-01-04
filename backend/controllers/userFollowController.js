import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc follow user
// @route POST /api/userFollow/follow
// @access Private
const followUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).send('User id not provided');
    return;
  }

  const { targetUserId } = req.body;

  // Check the target user exists
  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetUserId
    }
  });
  if (!targetUser) {
    res.status(400).send('Target user not found');
    return;
  }

  // Check if the target user is not followed by logged in user
  const followData = await prisma.userFollow.findFirst({
    where: {
      user_id: userId,
      following_user_id: targetUserId
    }
  });
  if (followData) {
    res.status(400).send('The target user is already on follow list');
    return;
  }

  try {
    const newFollowData = await prisma.userFollow.create({
      data: {
        user_id: userId,
        following_user_id: targetUserId
      }
    });

    res.status(201).json({
      follow_id: newFollowData.id,
      following_user_id: newFollowData.following_user_id
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      error: error
    });
  }
});

export {
  followUser,
}