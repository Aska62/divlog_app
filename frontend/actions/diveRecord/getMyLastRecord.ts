import axios from "axios";
import { DiveRecordHighlight } from "@/types/diveRecordTypes";

export async function getMyLastRecord():Promise<DiveRecordHighlight | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/last`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching last dive record:', error)
    });

    if (res?.data) {
      return res.data;
    }
}