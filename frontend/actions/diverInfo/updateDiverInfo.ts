import axios, { isAxiosError } from "axios";
import { DiverInfoType } from '@/types/diverInfoTypes';
import isString from '@/utils/isString';

export type DiverInfoStateType = Partial<DiverInfoType> & {
  success?: boolean,
  error?: Partial<Record<
    keyof Omit<DiverInfoType, 'id'>,
    string
  >>,
  message?: string,
  data?: DiverInfoType,
}

async function updateDiverInfo(_previousState: DiverInfoStateType, data:Partial<DiverInfoType>):Promise<DiverInfoStateType> {
  const newData = {
    norecord_dive_count: data['norecord_dive_count'] || 0,
    height             : data['height'] || null,
    weight             : data['weight'] || null,
    shoe               : data['shoe'] || null,
    measurement_unit   : data['measurement_unit'] || 1,
    languages          : data['languages'] || [],
  }
  const id = data['id'] || null;

  if (isString(newData.languages) && newData.languages.split(',').some((str) => str.length === 0)) {
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