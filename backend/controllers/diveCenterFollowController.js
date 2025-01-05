import { PrismaClient } from '@prisma/client';
import asyncHandler from "../middleware/asyncHandler.js";

const prisma = new PrismaClient();

// @desc follow dive center
// @route POST /api/diveCenterFollow/follow
// @access Private
const followDiveCenter = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).send('User id not provided');
    return;
  }

  const { diveCenterId } = req.body;

  // Check the target user exists
  const diveCenter = await prisma.diveCenter.findUnique({
    where: {
      id: diveCenterId
    }
  });

  if (!diveCenter) {
    res.status(400).send('Dive center not found');
    return;
  }

  // Check if the dive center is not followed by logged in user
  const followData = await prisma.diveCenterFollow.findFirst({
    where: {
      user_id: userId,
      following_dc_id: diveCenterId
    }
  });
  if (followData) {
    res.status(400).send('The dive center is already on follow list');
    return;
  }

  try {
    const newFollowData = await prisma.diveCenterFollow.create({
      data: {
        user_id: userId,
        following_dc_id: diveCenterId,
      }
    });

    res.status(201).json({
      follow_id: newFollowData.id,
      following_dc_id: newFollowData.following_dc_id
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      error: error
    });
  }
});

// @desc unfollow dive center
// @route DELETE /api/diveCenterFollow/unfollow
// @access Private
const unfollowDiveCenter = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.status(400).send('User id not provided');
    return;
  }

  const { diveCenterId } = req.body;
  // Check the target dive center exists
  const diveCenter = await prisma.diveCenter.findUnique({
    where: {
      id: diveCenterId
    }
  });

  if (!diveCenter) {
    res.status(400).send('Dive center not found');
    return;
  }

  // Check if the dive center is not followed by logged in user
  const followData = await prisma.diveCenterFollow.findFirst({
    where: {
      user_id: userId,
      following_dc_id: diveCenterId
    }
  });
  if (!followData) {
    res.status(400).send('Not following the dive center currently');
    return;
  }

  try {
    const unfollowed = await prisma.diveCenterFollow.delete({
      where: {
        id: followData.id
      }
    });

    res.status(201).json({
      user_id: unfollowed.user_id,
      unfollowed_dc_id: unfollowed.following_dc_id
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      error: error
    });
  }
});

export {
  followDiveCenter,
  unfollowDiveCenter,
}