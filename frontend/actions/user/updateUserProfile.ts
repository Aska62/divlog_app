import axios, { isAxiosError } from "axios";
import { UserType } from '@/types/userTypes';
import isNumString from "@/utils/isNumString";
import isString from '@/utils/isString';

export type UserProfileStateType = Partial<Omit<UserType, 'id'>> & {
  success?: boolean,
  error?: Partial<Record<
    | 'divlog_name'
    | 'license_name'
    | 'email'
    | 'certification'
    | 'cert_org_id'
    | 'message',
    string
  >>,
  message?: string,
  diveRecordId?: boolean,
}

async function updateUserProfile(_previousState: UserProfileStateType, formData: FormData):Promise<UserProfileStateType> {
  const data = {
    divlog_name  : formData.get('divlog_name'),
    license_name : isString(formData.get('license_name')) ? formData.get('license_name') : null,
    email        : formData.get('email'),
    certification: isString(formData.get('certification')) ? formData.get('certification') : null,
    cert_org_id  : isNumString(formData.get('cert_org_id')) ? formData.get('cert_org_id') : null,
  }

  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      { ...data },
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data.message,
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
        message: 'Update failed',
      }
    }
  }
}

export default updateUserProfile;