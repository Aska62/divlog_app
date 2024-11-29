import axios, { isAxiosError } from "axios";
import { DiveRecordDetail } from "@/types/diveRecordTypes";
import combineDateTime from "@/utils/dateTime/combineDateTime";
import isNumString from "@/utils/isNumString";

type DiveRecordStateType = {
  success: boolean,
  error?: Partial<Record<
    | 'log_no'
    | 'date'
    | 'location'
    | 'country_id'
    | 'purpose_id'
    | 'course'
    | 'weather'
    | 'surface_temperature'
    | 'water_temperature'
    | 'max_depth'
    | 'visibility'
    | 'start_time'
    | 'end_time'
    | 'tankpressure_start'
    | 'tankpressure_end'
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
    | 'is_draft'
    | 'message',
    string
  >>,
  message: string,
}

type DiveRecordFormType = DiveRecordDetail & DiveRecordStateType

async function updateDiveRecord(_previousState: DiveRecordFormType, formData: FormData):Promise<DiveRecordStateType> {
  const id = formData.get('id');
  const date = new Date(String(formData.get('date'))) || null;
  const starTime = formData.get('start_time') || null;
  const startDateTime =  starTime ? combineDateTime(new Date(date), String(starTime)) : null;
  const endTime = formData.get('end_time') || null;
  const endDateTime =  endTime ? combineDateTime(new Date(date), String(endTime)) : null;

  const data = {
    log_no             : isNumString(formData.get('log_no')) ? formData.get('log_no') : null,
    date               : date,
    location           : formData.get('location'),
    country_id         : isNumString(formData.get('country_id')) ? formData.get('country_id') : null,
    purpose_id         : isNumString(formData.get('purpose_id')) ? formData.get('purpose_id') : null,
    course             : formData.get('course'),
    weather            : formData.get('weather'),
    surface_temperature: isNumString(formData.get('surface_temperature')) ? formData.get('surface_temperature') : null,
    water_temperature  : isNumString(formData.get('water_temperature')) ? formData.get('water_temperature') : null,
    max_depth          : isNumString(formData.get('max_depth')) ? formData.get('max_depth') : null,
    visibility         : isNumString(formData.get('visibility')) ? formData.get('visibility') : null,
    start_time         : startDateTime,
    end_time           : endDateTime,
    tankpressure_start : isNumString(formData.get('tankpressure_start')) ? formData.get('tankpressure_start') : null,
    tankpressure_end   : isNumString(formData.get('tankpressure_end')) ? formData.get('tankpressure_end') : null,
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
    is_draft           : !!formData.get('is_draft'),
  }

  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/${id}`,
      { ...data },
      { withCredentials: true }
    );

    return {
      success: true,
      message: res.data
      // message: 'Successfully updated the record',
    }

  } catch (error) {
    console.log('Error: ', error);
    if (isAxiosError(error) && error.response) {
      console.log(error.response.data)
      return {
        success: false,
        message: error.response.data,
      };
    } else {
      return {
        success: false,
        message: 'Update failed',
      }
    }
  }
}

export default updateDiveRecord;