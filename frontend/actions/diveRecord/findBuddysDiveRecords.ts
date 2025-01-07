import axios from "axios";
import { UUID } from "crypto";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isObject from "@/utils/isObject";
import { DiveRecordHighlight } from '@/types/diveRecordTypes';
import { FindMyDiveRecordsParams } from '@/actions/diveRecord/findMyDiveRecords';

type FindBuddysDiveRecordsPrams =
  { userId: UUID} &
  Omit<FindMyDiveRecordsParams, 'status'> &
  Partial<
    Record<'isMyBuddyDive' | 'isMyInstruction', string>
  >;

type BuddyDiveRecordHighlight = Omit<
  DiveRecordHighlight,
  'is_draft'
> & {
  is_my_buddy_dive : boolean,
  is_my_instruction: boolean,
}

const isBuddyDiveRecordHighlight = (val: unknown): val is BuddyDiveRecordHighlight => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = [
    'id',
    'date',
    'is_my_buddy_dive',
    'is_my_instruction'
  ];

  const filteredKeys = Object.keys(val).filter(key => mustKeys.includes(key));

  return filteredKeys.length === mustKeys.length;
}

export type FindBuddysDiveRecordsArray = BuddyDiveRecordHighlight[];

export const isFindBuddysDiveRecordsArray = (val: unknown): val is FindBuddysDiveRecordsArray => {
  if (!val || !Array.isArray(val) || val.length === 0) {
    return false;
  }

  return val.find((v) => !isBuddyDiveRecordHighlight(v)) ? false : true;
}

type FindBuddysDiveRecordsReturn = {
  data?: FindBuddysDiveRecordsArray,
  error?:  string,
}

export async function findBuddysDiveRecords({
  userId,
  dateFrom,
  dateTo,
  logNoFrom,
  logNoTo,
  country,
  isMyBuddyDive,
  isMyInstruction
}: FindBuddysDiveRecordsPrams): Promise<FindBuddysDiveRecordsReturn> {
  const params = {
    dateFrom,
    dateTo,
    logNoFrom,
    logNoTo,
    country,
    isMyBuddyDive,
    isMyInstruction,
  }

  const conditions = isObjectEmpty(params) ?  { withCredentials: true } :  { params, withCredentials: true }

  try {
    const res = await axios.get<FindBuddysDiveRecordsArray>(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/view/${userId}`,
      conditions)

      if (isFindBuddysDiveRecordsArray(res.data)) {
        return { data: res.data };
      } else {
        return { error: 'Invalid data format received' };
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      return { error: 'Error fetching data'}
  }
}