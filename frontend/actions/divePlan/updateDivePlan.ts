import axios, { isAxiosError } from "axios";
import { DivePlanDetail } from "@/types/divePlanTypes";
import combineDateTime from "@/utils/dateTime/combineDateTime";
import isNumString from "@/utils/isNumString";

export type DivePlanStateType = Partial<DivePlanDetail> & {
  success?: boolean,
  error?: Partial<Record<
    | 'date'
    | 'location'
    | 'country_id'
    | 'purpose_id'
    | 'course'
    | 'max_depth'
    | 'start_time'
    | 'added_weight'
    | 'suit'
    | 'gears'
    | 'buddy_str'
    | 'buddy_ref'
    | 'supervisor_str'
    | 'supervisor_ref'
    | 'dive_center_str'
    | 'dive_center_id'
    | 'notes'
    | 'is_plan'
    | 'message',
    string
  >>,
  message?: string,
  diveRecordId?: boolean,
}

async function updateDivePlan(_previousState: DivePlanStateType, formData: FormData):Promise<DivePlanStateType> {
  const id = formData.get('id');
  const date = new Date(String(formData.get('date'))) || null;
  const starTime = formData.get('start_time') || null;
  const startDateTime =  starTime ? combineDateTime(new Date(date), String(starTime)) : null;
  const data = {
    date               : date,
    location           : formData.get('location'),
    country_id         : isNumString(formData.get('country_id')) ? formData.get('country_id') : null,
    purpose_id         : isNumString(formData.get('purpose_id')) ? formData.get('purpose_id') : null,
    course             : formData.get('course'),
    max_depth          : isNumString(formData.get('max_depth')) ? formData.get('max_depth') : null,
    start_time         : startDateTime,
    added_weight       : isNumString(formData.get('added_weight')) ? formData.get('added_weight') : null,
    suit               : formData.get('suit'),
    gears              : formData.get('gears'),
    buddy_str          : formData.get('buddy_str'),
    buddy_ref          : formData.get('buddy_ref'),
    supervisor_str     : formData.get('supervisor_str'),
    supervisor_ref     : formData.get('supervisor_ref'),
    dive_center_str    : formData.get('dive_center_str'),
    dive_center_id     : formData.get('dive_center_id'),
    notes              : formData.get('notes'),
  }

  console.log('updateDivePlan func', data)
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/divePlans/${id}`,
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

export default updateDivePlan;