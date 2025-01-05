import axios, { isAxiosError } from "axios";
import { UUID } from "crypto";
import isString from "@/utils/isString";

type unfollowDiveCenterParams = {
  diveCenterId: UUID,
}

type unfollowDiveCenterReturn = {
  success: boolean,
  message: string,
  data?: {
    user_id: UUID,
    unfollowed_dc_id: UUID,
  },
  error?: string,
}

async function unfollowDiveCenter({diveCenterId}:unfollowDiveCenterParams): Promise<unfollowDiveCenterReturn> {
  if (!diveCenterId || !isString(diveCenterId)) {
    return {
      success: false,
      message: 'Target dive center not specified',
    }
  }

  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/diveCenterFollow/unfollow`,
      {
        data: { diveCenterId: diveCenterId },
        withCredentials: true
      }
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

export default unfollowDiveCenter;