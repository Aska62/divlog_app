import { UUID } from "crypto";
import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isString from "@/utils/isString";
import { UserType } from '@/types/userTypes';

export type DiveCenter = {
  id             : UUID,
  name           : string,
  country        : string,
  organization   : string,
  staffs         : {
    id: UUID,
    divlog_name  : string,
    license_name?: string,
  }[],
  is_my_center   : boolean,
  follower_count : number,
  is_following   : boolean,
}

export type DiveCenterHighLight = Exclude<DiveCenter, 'staffs' | 'follower_count'>;

export const isDiveCenterHighLight = (val:unknown): val is UserType => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const keys = ['id', 'name', 'country', 'email', 'organization'];

  const wrongEntries = Object.entries(val).filter(([k, v]) =>
    !keys.includes(k) || (!isString(v))
  );

  if (wrongEntries.length > 0) {
    return false;
  }

  return true;
}