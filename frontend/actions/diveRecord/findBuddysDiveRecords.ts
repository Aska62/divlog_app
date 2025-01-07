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
  'user_id' | 'country_id' | 'is_draft' | 'country'
> & {
  country?: string,
  is_my_buddy_dive: boolean,
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

  if (filteredKeys.length !== mustKeys.length) {
    return false;
  }

  return true;
}

type FindBuddysDiveRecordsReturn = BuddyDiveRecordHighlight[];

const isFindBuddysDiveRecordsReturn = (val: unknown): val is FindBuddysDiveRecordsReturn => {
  if (!val || !Array.isArray(val) || val.length === 0) {
    return false;
  }

  return !!val.find((v) => !isBuddyDiveRecordHighlight(v));
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
}: FindBuddysDiveRecordsPrams): Promise<FindBuddysDiveRecordsReturn | void> {
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

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/view/${userId}`,
    conditions)
    .catch((error) => {
      console.log('Error fetching data:', error)
    });

    return (res && isFindBuddysDiveRecordsReturn(res.data)) ? res.data : [];
}