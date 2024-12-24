import axios from "axios";
import { UserType } from "@/types/userTypes";

type FindUsersParams = {
  keyword: string,
  status: 1 | 2 | 3,
}

export type UserHighlight = Pick<UserType, 'id' | 'divlog_name' | 'license_name'>

export type FindUsersReturn = UserHighlight[]

export async function findUsers({keyword, status}: FindUsersParams):Promise<FindUsersReturn | void> {
  console.log('findUsers', keyword, status)
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find/${status}/${keyword}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (res) {
      return res.data;
    }
}