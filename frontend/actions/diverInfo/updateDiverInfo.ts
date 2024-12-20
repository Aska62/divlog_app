import axios, { isAxiosError } from "axios";
import { DiverInfoType } from '@/types/diverInfoTypes';
import isString from '@/utils/isString';

export type DiverInfoStateType = Partial<DiverInfoType> & {
  success?: boolean,
  error?: Partial<Record<
    keyof Exclude<DiverInfoType, 'id'>,
    string
  >>,
  message?: string,
  data?: DiverInfoType,
}

async function updateDiverInfo(_previousState: DiverInfoStateType, formData: FormData):Promise<DiverInfoStateType> {
  const data = {
    norecord_dive_count: formData.get('norecord_dive_count') || 0,
    height             : formData.get('height') || null,
    weight             : formData.get('weight') || null,
    shoe               : formData.get('shoe') || null,
    measurement_unit   : formData.get('measurement_unit') || 1,
    languages          : formData.get('languages') || [],
  }
  const id = formData.get('id') || null;

  if (isString(data.languages) && data.languages.split(',').some((str) => str.length === 0)) {
    return {
      success: false,
      message: 'Delete or fill the empty language input',
    };
  }

  try {
    if (id) {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/diverInfo`,
        { ...data, id },
        { withCredentials: true }
      );
      return {
        success: true,
        data: res.data.diverInfo,
      }
    } else {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/diverInfo`,
        { ...data },
        { withCredentials: true }
      );
      return {
        success: true,
        data: res.data.diverInfo,
      }
    }

  } catch (error) {
    console.log('Error: ', error);
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

export default updateDiverInfo;