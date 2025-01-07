import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isArray from "@/utils/isArray";
import isString from "@/utils/isString";

// Dive record highlight
export type DiveRecordHighlight = {
  id                  : string,
  log_no?             : number,
  date                : Date,
  location?           : string,
  is_draft            : boolean,
  country?            : string,
}

export const isDiveRecordHighlight = (val: unknown): val is DiveRecordHighlight => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = [
    'id',
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

// Full dive record
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

export type DiveRecordDetailKey = keyof Omit<DiveRecordDetail, 'country' | 'purpose' | 'buddy' | 'supervisor' | 'dive_center'>;

const diveRecordDetailKeys: DiveRecordDetailKey[] = [
  'id',
  'user_id',
  'log_no',
  'date',
  'location',
  'country_id',
  'purpose_id',
  'course',
  'weather',
  'surface_temperature',
  'water_temperature',
  'max_depth',
  'visibility',
  'start_time',
  'end_time',
  'tankpressure_start',
  'tankpressure_end',
  'added_weight',
  'suit',
  'gears',
  'buddy_str',
  'buddy_ref',
  'supervisor_str',
  'supervisor_ref',
  'dive_center_str',
  'dive_center_id',
  'notes',
  'is_draft',
  'created_at',
  'updated_at',
]

export const isDiveRecordDetailKey = (val: unknown): val is DiveRecordDetailKey => {
  if (!val || !isString(val)) {
    return false;
  }

  return diveRecordDetailKeys.some((key) => key === val);
}

type KeyWithNumVal = keyof Pick<DiveRecordDetail,
  | 'log_no'
  | 'surface_temperature'
  | 'water_temperature'
  | 'max_depth'
  | 'visibility'
  | 'tankpressure_start'
  | 'tankpressure_end'
  | 'added_weight'
>;

export const isKeyWithNumVal = (val:unknown): val is KeyWithNumVal => {
  if (!val || !isString(val)) {
    return false;
  }

  const keysWithNumVal = [
    'log_no',
    'surface_temperature',
    'water_temperature',
    'max_depth',
    'visibility',
    'tankpressure_start',
    'tankpressure_end',
    'added_weight'
  ];

  return keysWithNumVal.some((key) => key === val);
}

type KeyWithSelectVal = keyof Pick<DiveRecordDetail,
  | 'country_id'
  | 'purpose_id'
>;

export const isKeyWithSelectVal = (val:unknown): val is KeyWithSelectVal => {
  if (!val || !isString(val)) {
    return false;
  }

  const keysWithSelectVal = [
    'country_id',
    'purpose_id',
  ];

  return keysWithSelectVal.some((key) => key === val);
}

type KeyWithDateVal = keyof Pick<DiveRecordDetail,
  | 'date'
  | 'start_time'
  | 'end_time'
>

export const isKeyWithDateVal = (val:unknown): val is KeyWithDateVal => {
  if (!val || !isString(val)) {
    return false;
  }

  const keysWithDateVal = [
    'date',
    'start_time',
    'end_time'
  ];

  return keysWithDateVal.some((key) => key === val);
}

type KeyWithStringVal = keyof Pick<DiveRecordDetail,
  | 'location'
  | 'course'
  | 'weather'
  | 'suit'
  | 'gears'
  | 'buddy_str'
  | 'supervisor_str'
  | 'dive_center_str'
  | 'notes'
  >

export const isKeyWithStringVal = (val:unknown): val is KeyWithStringVal => {
  const keysWithStringVal = [
    'location',
    'course',
    'weather',
    'suit',
    'gears',
    'buddy_str',
    'supervisor_str',
    'dive_center_str',
    'notes'
  ]
  return keysWithStringVal.some((key) => key === val);
}

export type keyWithMustVal = keyof Pick<DiveRecordDetail,
  | 'log_no'
  | 'date'
  | 'is_draft'
>;

export const isKeyWithMustVal = (val: unknown): val is keyWithMustVal => {
  if (!val || !isString(val)) {
    return false;
  }

  const keysWithMustVal = [
    'log_no',
    'date',
    'is_draft'
  ];

  return keysWithMustVal.some((key) => key === val);
}

export type DiveRecordCount = {
  total: number,
  recorded: number,
  withoutRecord: number,
}