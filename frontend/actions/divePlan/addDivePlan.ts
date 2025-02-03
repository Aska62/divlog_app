import axios, { isAxiosError } from "axios";
import combineDateTime from "@/utils/dateTime/combineDateTime";
import isNumString from "@/utils/isNumString";
import { DivePlanStateType } from "./updateDivePlan";

async function addDivePlan(_previousState: DivePlanStateType, formData: FormData):Promise<DivePlanStateType> {
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

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/divePlans`,
      { ...data },
      { withCredentials: true }
    );

    return {
      success: true,
      message: 'Successfully added new Plan',
      divePlanId: res.data.id
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
        message: 'Plan addition failed',
      }
    }
  }
}

export default addDivePlan;