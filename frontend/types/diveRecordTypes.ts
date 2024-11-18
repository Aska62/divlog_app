import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isArray from "@/utils/isArray";

export type DiveRecord = {
  id                  : string,
  user_id             : string,
  log_no?             : number,
  date                : Date,
  location?           : string,
  country_id?         : number,
  purpose_id?         : number,
  course?             : string,
  weather?            : string,
  surface_temperature?: number,
  water_temperature?  : number,
  max_depth?          : number,
  visibility?         : number,
  start_time?         : Date,
  end_time?           : Date,
  tankpressure_start? : number,
  tankpressure_end ?  : number,
  added_weight ?      : number,
  suit?               : string,
  gears?              : string,
  buddy_str?          : string,
  buddy_ref?          : string,
  supervisor_str?     : string,
  supervisor_ref?     : string,
  dive_center_str?    : string,
  dive_center_id?     : string,
  notes?              : string,
  is_draft            : boolean,
  created_at          : Date,
  updated_at          : Date,
  country?            : { name: string },
}

export const isDiveRecord = (val: unknown): val is DiveRecord => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = [
    'id',
    'user_id',
    'is_draft',
    'created_at',
    'updated_at',
  ];

  const filteredKeys = Object.keys(val).filter(key => mustKeys.includes(key));

  if (filteredKeys.length !== mustKeys.length) {
    return false;
  }

  return true;
}

export const isDiveRecordArray = (val:unknown): val is [DiveRecord] => {
  if (!val || !isArray(val)) {
    return false;
  };

  const wrongEntry = val.filter((entry) => !isDiveRecord(entry));
  if (wrongEntry.length > 0) {
    return false;
  }
  return true;
}
