import axios from "axios";
import { UUID } from "crypto";


export async function getDivlogNameById(id: UUID):Promise<{divlog_name: string} | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/divlogName/${id}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching divlog_name:', error)
    });

    if (res) {
      return res.data;
    }
}