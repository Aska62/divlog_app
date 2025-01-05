import axios, { isAxiosError } from "axios";
import { UUID } from "crypto";
import isString from "@/utils/isString";

type FollowDiveCenterParams = {
  diveCenterId: UUID,
}

type FollowDiveCenterReturn = {
  success: boolean,
  message: string,
  data?: {
    follow_id: number,
    following_dc_id: UUID,
  },
  error?: string,
}

async function followDiveCenter({diveCenterId}:FollowDiveCenterParams): Promise<FollowDiveCenterReturn> {
  if (!diveCenterId || !isString(diveCenterId)) {
    return {
      success: false,
      message: 'Target dive center not specified',
    }
  }

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/diveCenterFollow/follow`,
      { diveCenterId: diveCenterId },
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

export default followDiveCenter;