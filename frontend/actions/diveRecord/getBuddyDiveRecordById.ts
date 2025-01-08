import axios from "axios";
import { DiveRecordDetail } from "@/types/diveRecordTypes";
import { UUID } from "crypto";

type GetBuddyDiveRecordByIdParams = Record<'userId' | 'recordId', UUID>;

export async function getBuddyDiveRecordById({ userId, recordId }: GetBuddyDiveRecordByIdParams): Promise<DiveRecordDetail | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/view/${userId}/${recordId}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching dive record:', error);
    });

    if (res) {
      return res.data
    }
}