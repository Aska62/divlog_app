import axios, { isAxiosError } from "axios";
import { UUID } from "crypto";
import isString from "@/utils/isString";

type FollowUserParams = {
  targetUserId: UUID,
}

type FollowUserReturn = {
  success: boolean,
  message: string,
  data?: {
    follow_id: number,
    following_user_id: UUID,
  },
  error?: string,
}

async function followUser({targetUserId}:FollowUserParams): Promise<FollowUserReturn> {
  if (!targetUserId || !isString(targetUserId)) {
    return {
      success: false,
      message: 'Target user not specified',
    }
  }

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/userFollow/follow`,
      { targetUserId: targetUserId },
      { withCredentials: true }
    );

    return {
      success: true,
      message: 'Successfully followed',
      data: res.data,
    }

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message,
        error: error.response.data.error,
      };
    } else {
      return {
        success: false,
        message: 'Failed in following',
      }
    }
  }
}

export default followUser;