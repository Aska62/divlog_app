import axios, { isAxiosError } from "axios";
import { UUID } from "crypto";
import isString from "@/utils/isString";

type unfollowUserParams = {
  targetUserId: UUID,
}

type unfollowUserReturn = {
  success: boolean,
  message: string,
  data?: {
    user_id: UUID,
    unfollowed_user_id: UUID,
  },
  error?: string,
}

async function unfollowUser({targetUserId}:unfollowUserParams): Promise<unfollowUserReturn> {
  if (!targetUserId || !isString(targetUserId)) {
    return {
      success: false,
      message: 'Target user not specified',
    }
  }

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/userFollow/unfollow`,
      { targetUserId: targetUserId },
      { withCredentials: true }
    );

    return {
      success: true,
      message: 'Successfully unfollowed',
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
        message: 'Failed in unfollowing',
      }
    }
  }
}

export default unfollowUser;