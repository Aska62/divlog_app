import axios from "axios";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isString from "@/utils/isString";
import { UserType } from "@/types/userTypes";

type FindUsersParams = {
  keyword: string,
  status: 1 | 2 | 3,
}

export const isFindUsersParams = (value: unknown): value is FindUsersParams => {
  if (!value || isObjectEmpty(value)) {
    return false;
  }

  return !!Object.entries(value).find(([i, val]) => !(
    (i === 'keyword' && isString(val))
    || (i === 'status' && [1, 2, 3].includes(val)))
  )
}

export type UserHighlight = Pick<UserType, 'id' | 'divlog_name' | 'license_name'>

export type FindUsersReturn = UserHighlight[]

export async function findUsers({keyword, status}: FindUsersParams):Promise<FindUsersReturn | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find/${status}/${keyword}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (res) {
      return res.data;
    }
}