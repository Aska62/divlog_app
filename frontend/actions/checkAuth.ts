import axios  from "axios";
import { UUID } from "crypto";

async function checkAuth(): Promise<UUID | void> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, { withCredentials: true });

    return res.data.userId;
  } catch (error) {
    console.log('Error:', error);
  }
}

export default checkAuth;