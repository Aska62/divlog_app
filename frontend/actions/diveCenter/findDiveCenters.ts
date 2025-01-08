import axios from "axios";
import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import { DiveCenterHighLight, isDiveCenterHighLight} from '@/types/diveCenterTypes';

type FindDiveCentersParams = {
  keyword     : string,
  country     : number | '',
  organization: number | '',
  status      : 1 | 2,
}

export const isFindDiveCentersParams = (val:unknown): val is FindDiveCentersParams => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const keys = [
    'keyword',
    'country',
    'organization',
    'status'
  ];

  return Object.keys(val).every(k => keys.includes(k));
}

export type FindDiveCentersReturn = DiveCenterHighLight[];

export const isFindDiveCentersReturn = (value: unknown): value is FindDiveCentersReturn => {
  if (!value || !Array.isArray(value)) {
    return false;
  }

  return !value.find((val) => !isDiveCenterHighLight(val));
}

export async function findDiveCenters({keyword, country, organization, status}: FindDiveCentersParams):Promise<FindDiveCentersReturn | void> {

  const params = {
    keyword,
    country,
    organization,
    status,
  }

  const conditions = isObjectEmpty(params) ?  { withCredentials: true } :  { params, withCredentials: true }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveCenters/find`,
    conditions)
    .catch((error) => {
      console.log('Error fetching dive center data:', error)
    });

    if (res) {
      return res.data;
    }
}