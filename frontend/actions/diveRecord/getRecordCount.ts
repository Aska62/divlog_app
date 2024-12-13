import axios from "axios";
import { DiveRecordCount } from "@/types/diveRecordTypes";

export async function getRecordCount():Promise<DiveRecordCount | void> {

  const count = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/count`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error record count:', error)
    });

    if (count?.data) {
      return count.data;
    }
}