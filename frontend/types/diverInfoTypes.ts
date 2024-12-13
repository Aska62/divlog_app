import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isNumber from "@/utils/isNumber";
import isString from '@/utils/isString';

export type DiverInfoType =
  {
    id                  : string,
    norecord_dive_count?: number,
    height             ?: number,
    weight             ?: number,
    shoe               ?: number,
    measurement_unit   ?: number,
    languages          ?: string[]
  }

export const isDiverInfoType = (val:unknown): val is DiverInfoType => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const keys = ['id', 'norecord_dive_count', 'height', 'shoe', 'measurement_unit', 'languages'];

  const wrongEntries = Object.entries(val).filter(([k, v]) =>
    !keys.includes(k)
    || (!['id', 'languages'].includes(v) && !isNumber(v))
    || (k === 'languages'
        && (!Array.isArray(v)
          || v.some((val) => !isString(val)))
        )
  );

  if (wrongEntries.length > 0) {
    return false;
  }

  return true;
}
