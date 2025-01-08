import axios from "axios";
import isObject from "@/utils/isObject";
import { DiveRecordDetail } from "@/types/diveRecordTypes";
import { UUID } from "crypto";

type GetBuddyDiveRecordByIdParams = Record<'userId' | 'recordId', UUID>;

export type GetBuddyDiveRecordReturn = Exclude<DiveRecordDetail, 'is_draft'> & {
  owner: {
    id: UUID,
    divlog_name: string,
  }
}

export const isDiveRecordDetailReturn = (value: unknown): value is GetBuddyDiveRecordReturn => {
  if (!value || !isObject(value)) {
    return false;
  }

  const mustKeys = [
    'id',
    'user_id',
    'date',
    'is_draft',
    'owner'
  ];

  const filteredKeys = Object.keys(value).filter(key => mustKeys.includes(key));

  return filteredKeys.length === mustKeys.length;
}

export async function getBuddyDiveRecordById({ userId, recordId }: GetBuddyDiveRecordByIdParams): Promise<GetBuddyDiveRecordReturn | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/view/${userId}/${recordId}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching dive record:', error);
    });

    if (res) {
      return res.data
    }
}