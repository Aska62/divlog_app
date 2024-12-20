import axios from "axios";
import { DiverInfoType } from "@/types/diverInfoTypes";

export async function getDiverInfo():Promise<DiverInfoType | void> {

  const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diverInfo`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (user?.data) {
      return user.data;
    }
}