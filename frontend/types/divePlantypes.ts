import { DiveRecordHighlight } from "./diveRecordTypes";
import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isArray from "@/utils/isArray";

export type DivePlanHighLight = Omit<DiveRecordHighlight, 'is_draft'>;

export const isDivePlanHighlight = (val: unknown): val is DivePlanHighLight => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = [
    'id',
    'date',
  ];

  const filteredKeys = Object.keys(val).filter(key => mustKeys.includes(key));

  return filteredKeys.length === mustKeys.length;
}


export const isDivePlanHighlightArray = (val:unknown): val is DivePlanHighLight[] => {
  if (!val || !isArray(val)) {
    return false;
  };

  const wrongEntry = val.filter((entry) => !isDivePlanHighlight(entry));
  return wrongEntry.length === 0;
}

// Dive plan detail
export type DivePlanDetail = {
  id                  : string,
  user_id             : string,
  date                : Date,
  location?           : string,
  course?             : string,
  max_depth?          : number,
  start_time?         : Date,
  added_weight ?      : number,
  suit?               : string,
  gears?              : string,
  buddy_str?          : string,
  supervisor_str?     : string,
  dive_center_str?    : string,
  notes?              : string,
  created_at          : Date,
  updated_at          : Date,
  country?            : { id: string, name: string },
  purpose?            : { id: string, name: string },
  buddy?              : { id: string, divlog_name: string },
  supervisor?         : { id: string, divlog_name: string },
  dive_center?        : { id: string, name: string }
}

export const isDivePlanDetail = (val: unknown): val is DivePlanDetail => {
  if (!val || !isObject(val)) {
    return false;
  }

  const mustKeys = [
    'id',
    'user_id',
    'date',
    'created_at',
    'updated_at'
  ];

  const filteredKeys = Object.keys(val).filter(key => mustKeys.includes(key));

  return filteredKeys.length === mustKeys.length;
}