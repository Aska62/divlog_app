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