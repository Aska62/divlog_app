import axios from "axios";
import isObjectEmpty from "@/utils/isObjectEmpty";
import { isStringOrEmptyString } from "@/utils/isString";
import { UserType } from "@/types/userTypes";

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

export type UserHighlight = Pick<UserType, 'id' | 'divlog_name' | 'license_name'>

export type FindUsersReturn = UserHighlight[]

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