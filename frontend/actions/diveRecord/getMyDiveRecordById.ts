import axios from "axios";
import { DiveRecordDetail } from "@/types/diveRecordTypes";
import { UUID } from "crypto";

export async function getMyDiveRecordById(id: UUID): Promise<DiveRecordDetail | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/${id}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching last dive record:', error);
    });


    if (res) {
      return res.data
    }
}