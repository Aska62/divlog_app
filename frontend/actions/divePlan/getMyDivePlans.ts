import axios from "axios";
import { isDivePlanHighlightArray, DivePlanHighLight } from "@/types/divePlanTypes";

export async function getMyDivePlans(): Promise<DivePlanHighLight[] | void> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/divePlans`,
    { withCredentials: true }
    )
    .catch((error) => {
      console.log('Error fetching dive plans:', error)
    });

    if (res && isDivePlanHighlightArray(res.data)) {
      return res.data;
    }
}