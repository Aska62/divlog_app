'use client';
import { useState, useEffect } from 'react';
import { UUID } from 'crypto';
import { getBuddyProfile, GetBuddyProfileReturn } from '@/actions/user/getBuddyProfile';
import Heading from "@/components/Heading";
import FollowIcon, { statusFollowing, statusFollowed } from '@/components/buddies/FollowIcon';

type BuddyPageParams = {
  params: Promise<{ id: UUID }>
}

const BuddyDetailPage:React.FC<BuddyPageParams> = ({ params }) => {

  const userInfo = localStorage.getItem('userInfo');
  const userId = userInfo ? JSON.parse(userInfo).id : null;
  const [user, setUser] = useState<Partial<GetBuddyProfileReturn>>({});

  useEffect(() => {
    const getUser = async() => {
      const { id } = await params;
      const funcParams = {
        id,
        loggedInUserId: userId,
      }

      const user = await getBuddyProfile(funcParams);
      if (user) {
        setUser(user);
      }
    }
    getUser();
  }, [params, userId]);
  // TODO:
  const onFollowBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('clicked')
  }

  return (
    <>
      <Heading pageTitle="Buddy's Profile" />
      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12">
        <div className="w-12 flex justify-around ml-auto mr-0">
          {user.followed && <FollowIcon status={statusFollowing} />}
          {user.following && <FollowIcon status={statusFollowed} />}
        </div>

        {/* User name */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">User name: </p>
          <p className="text-lg">{user.divlog_name}</p>
        </div>

        {/* Name on license */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Name on license: </p>
          <p className="text-lg">{user.license_name}</p>
        </div>

        {/* Email */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Email: </p>
          <p className="text-lg">{user.email}</p>
        </div>

        {/* Certificate */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Certificate: </p>
          <p className="text-lg">{user.certification}</p>
        </div>

        {/* Certificate issuer */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Certificate issuer: </p>
          <p className="text-lg">{user.organization?.name}</p>
        </div>
      </div>

      {!user.followed && (
        <div className='w-8/12 md:w-1/3 max-w-md mx-auto'>
          <button
            type='button'
            onClick={(e) => onFollowBtnClick(e)}
            className='bg-darkBlue dark:bg-lightBlue hover:bg-darkBlueLight dark:hover:bg-lightBlue text-lightBlue dark:text-darkBlue dark:hover:text-darkBlueLight px-2 py-1 rounded-md'
          >
            Follow
          </button>
        </div>
      )}
    </>
  );
}

export default BuddyDetailPage;