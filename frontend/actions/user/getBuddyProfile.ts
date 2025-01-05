import axios from "axios";
import { UserProfile } from '@/actions/user/getUserProfile';
import { UUID } from "crypto";

type GetBuddyProfileParams = {
  id: UUID,
  loggedInUserId: UUID | null,
}

export type GetBuddyProfileReturn = Exclude<UserProfile, 'email'> & Record<
  'is_following' | 'is_followed', boolean
>;

export async function getBuddyProfile({id, loggedInUserId}: GetBuddyProfileParams): Promise<GetBuddyProfileReturn | void> {

  const params = {
    loginUser: loggedInUserId,
  }

  const user = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
    { params,
      withCredentials: true
    })
    .catch((error) => {
      console.log('Error fetching user data:', error)
    });

    if (user) {
      return user.data;
    }
}