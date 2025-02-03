import axios from "axios";
import { DivePlanDetail, isDivePlanDetail } from "@/types/divePlanTypes";
import { UUID } from "crypto";

export async function getMyDivePlanById(id: UUID): Promise<DivePlanDetail | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/divePlans/${id}`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching last dive record:', error);
    });

    if (res && isDivePlanDetail(res.data)) {
      return res.data
    }
}