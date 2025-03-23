import axios from "axios";
import { DiveRecordCount } from "@/types/diveRecordTypes";
import { UUID } from "crypto";

type GetLastRecordByUserIdParams = Record<'userId', UUID>;

export async function getLastRecordByUserId({ userId }: GetLastRecordByUserIdParams):Promise<DiveRecordCount | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/last/${userId}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching last dive record:', error)
    });

    if (res?.data) {
      return res.data;
    }
}