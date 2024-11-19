import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isArray from "@/utils/isArray";

export type DiveRecordHighlight = {
  id                  : string,
  user_id             : string,
  log_no?             : number,
  date                : Date,
  location?           : string,
  country_id?         : number,
  is_draft            : boolean,
  country?            : { name: string },
}

export const isDiveRecordHighlight = (val: unknown): val is DiveRecordHighlight => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = [
    'id',
    'user_id',
    'date',
    'is_draft',
  ];

  const filteredKeys = Object.keys(val).filter(key => mustKeys.includes(key));

  if (filteredKeys.length !== mustKeys.length) {
    return false;
  }

  return true;
}

export const isDiveRecordHighlightArray = (val:unknown): val is [DiveRecordHighlight] => {
  if (!val || !isArray(val)) {
    return false;
  };

  const wrongEntry = val.filter((entry) => !isDiveRecordHighlight(entry));
  if (wrongEntry.length > 0) {
    return false;
  }
  return true;
}

export type DiveRecordDetail = {
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
  purpose?            : { name: string },
  buddy?              : { id: string, divlog_name: string },
  supervisor?         : { id: string, divlog_name: string },
  dive_center?        : { id: string, name: string }
}


export const isDiveRecordDetail = (val: unknown): val is DiveRecordDetail => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = [
    'id',
    'user_id',
    'date',
    'is_draft',
  ];

  const filteredKeys = Object.keys(val).filter(key => mustKeys.includes(key));

  if (filteredKeys.length !== mustKeys.length) {
    return false;
  }

  return true;
}