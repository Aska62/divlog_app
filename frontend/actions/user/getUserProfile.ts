import axios from "axios";

export type UserProfile = {
  id            : string,
  divlog_name   : string,
  license_name? : string,
  email         : string,
  certification?: string,
  cert_org_id?  : number,
}

export async function getUserProfile():Promise<UserProfile | void> {

  const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
    { withCredentials: true })
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (user) {
      return user.data;
    }
}