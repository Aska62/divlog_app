import axios from "axios";
import isObjectEmpty from "@/utils/isObjectEmpty";
import { isDiveRecordHighlightArray, DiveRecordHighlight } from '@/types/diveRecordTypes';

export type FindMyDiveRecordsParams = Partial<
  Record<
    | 'dateFrom'
    | 'dateTo'
    | 'logNoFrom'
    | 'logNoTo'
    | 'country'
    | 'status',
    string
  >
>

export async function findMyDiveRecords({dateFrom, dateTo, logNoFrom, logNoTo, country, status}: FindMyDiveRecordsParams):Promise<DiveRecordHighlight[] | void> {
  const params = {
    dateFrom,
    dateTo,
    logNoFrom,
    logNoTo,
    country,
    status,
  }

  const conditions = isObjectEmpty(params) ?  { withCredentials: true } :  { params, withCredentials: true }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/search`,
    conditions)
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (res && isDiveRecordHighlightArray(res.data)) {
      return res.data;
    }
}