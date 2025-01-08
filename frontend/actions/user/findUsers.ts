import axios from "axios";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isString, { isStringOrEmptyString } from "@/utils/isString";
import { UserType } from "@/types/userTypes";
import isObject from "@/utils/isObject";

type FindUsersParams = {
  keyword: string,
  status: 1 | 2 | 3,
}

export const isFindUsersParams = (value: unknown): value is FindUsersParams => {
  if (!value || isObjectEmpty(value)) {
    return false;
  }

  return !Object.entries(value).find(([i, val]) => !(
    (i === 'keyword' && isStringOrEmptyString(val))
    || (i === 'status' && [1, 2, 3].includes(val)))
  )
}

export type UserHighlight = Pick<
  UserType, 'id' | 'divlog_name' | 'license_name'
> & Record<'is_following' | 'is_followed', boolean>

export const isUserHighLight = (value: unknown): value is UserHighlight => {
  if (!value || !isObject(value)) {
    return false;
  }

  const mustKeys = ['id', 'divlog_name', 'license_name', 'is_following', 'is_followed'];
  if (Object.keys(value).find((key) => !mustKeys.includes(key))) {
    return false;
  }

  return !Object.entries(value).find(([key, val]) => {
    return (['is_following', 'is_followed'].includes(key) && typeof val !== 'boolean')
    || !['is_following', 'is_followed'].includes(key) && !isString(val)
  });
}

export type FindUsersReturn = UserHighlight[];

export const isFindUsersReturn = (value: unknown): value is FindUsersReturn => {
  if (!value || !Array.isArray(value)) {
    return false;
  }

  return !!value.find((val) => !isUserHighLight(val));
}

export async function findUsers({keyword, status}: FindUsersParams):Promise<FindUsersReturn | void> {

  const params = {
    keyword,
    status,
  }

  const conditions = isObjectEmpty(params) ?  { withCredentials: true } :  { params, withCredentials: true }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find`,
    conditions)
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (res) {
      return res.data;
    }
}