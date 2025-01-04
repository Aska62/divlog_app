import axios from "axios";
import { UserType } from "@/types/userTypes";
import { UUID } from "crypto";

export type UserProfile = UserType & {
  dive_centers: {
    id: UUID,
    name: string,
  }[],
  organization? : {
    id: number,
    name: string,
  },
}

export async function getUserProfile():Promise<UserProfile | void> {

  const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (user) {
      return user.data;
    }
}