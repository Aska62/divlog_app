import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isString from "@/utils/isString";
import isNumber from "@/utils/isNumber";

export type DivePurposeType = {
  id: string,
  name: string,
}

export const isDivePurposeType = (val:unknown): val is DivePurposeType => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const keys = ['id', 'name'];

  const wrongEntries = Object.entries(val).filter(([k, v]) =>
    !keys.includes(k) || (k === 'id' && !isNumber(v)) || (k === 'name' && !isString(v))
  );

  if (wrongEntries.length > 0) {
    return false;
  }

  return true;
}
