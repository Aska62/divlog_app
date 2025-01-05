import axios from "axios";
import { UUID } from "crypto";
import { DiveCenter } from '@/types/diveCenterTypes';

type GetDiveCenterInfoParams = {
  diveCenterId: UUID,
}

export async function getDiveCenterInfo({diveCenterId}: GetDiveCenterInfoParams): Promise<DiveCenter | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveCenters/${diveCenterId}`,
    {
      withCredentials: true
    })
    .catch((error) => {
      console.log('Error fetching dive center info:', error)
    });

    if (res) {
      return res.data;
    }
}