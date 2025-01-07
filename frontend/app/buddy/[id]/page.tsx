'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { IoIosArrowForward } from "react-icons/io";
import isObjectEmpty from "@/utils/isObjectEmpty";
import { getBuddyProfile, GetBuddyProfileReturn } from '@/actions/user/getBuddyProfile';
import followUser from '@/actions/userFollow/followUser';
import unfollowUser from '@/actions/userFollow/unfollowUser';
import Heading from "@/components/Heading";
import FollowIcon, { statusFollowing, statusFollowed } from '@/components/buddies/FollowIcon';

type BuddyPageParams = {
  params: Promise<{ id: UUID }>
}

const BuddyDetailPage:React.FC<BuddyPageParams> = ({ params }) => {
  const pathName = usePathname();

  const [loggedInUserId, setLoggedInUserId] = useState<UUID | null>(null);
  const [user, setUser] = useState<Partial<GetBuddyProfileReturn>>({});

  useEffect(() => {
    const userInfo = window.localStorage.getItem('userInfo');
    setLoggedInUserId(userInfo ? JSON.parse(userInfo).id : null);
  }, []);

  useEffect(() => {
    const getUser = async() => {
      const { id } = await params;
      const funcParams = {
        id,
        loggedInUserId: loggedInUserId,
      }

      const userData = await getBuddyProfile(funcParams);
      if (userData) {
        setUser(userData);
      }
    }

    if (isObjectEmpty(user)) {
      getUser();
    }
  }, [params, loggedInUserId, user]);

  const onFollowBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user.id) {
      try {
        const res = await followUser({targetUserId: user.id});
        if (res.data) {
          setUser({...user, ...{followed: true}});
        } else {
          console.log('Error while trying to follow:', res.message);
        }
      } catch (error) {
        console.log('Error:', error)
        toast.error(`Failed to follow user ${user.divlog_name}`);
      }
    }
  }

  const onUnFollowBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user.id) {
      try {
        const res = await unfollowUser({targetUserId: user.id});
        if (res.data) {
          setUser({...user, ...{followed: false}});
        } else {
          console.log('Error while trying to unfollow:', res.message)
        }
      } catch (error) {
        console.log('Error:', error)
        toast.error(`Failed to unfollow user ${user.divlog_name}`);
      }
    }
  }

  return (
    <>
      <Heading pageTitle="Buddy's Profile" />
      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12">

        <div className='mb-6 flex flex-col items-end'>
          {/* Follow icons */}
          <div className="w-12 flex justify-around ml-auto mr-0 mb-3">
            {user.is_following && <FollowIcon status={statusFollowing} />}
            {user.is_followed && <FollowIcon status={statusFollowed} />}
          </div>

          {/* Follow/unfollow button */}
          <button
            type='button'
            onClick={(e) => {
              if (user.is_following) {
                onUnFollowBtnClick(e);
              } else {
                onFollowBtnClick(e);
              }
            }}
            className={`${user.is_following ? 'bg-eyeCatchDark hover:bg-eyeCatch text-baseWhite' : 'bg-darkBlue dark:bg-lightBlue hover:bg-darkBlueLight dark:hover:bg-lightBlue text-lightBlue dark:text-darkBlue dark:hover:text-darkBlueLight'} h-8 w-20 px-2 py-1 rounded-md`}
          >
            {user.is_following ? 'Unfollow' : 'Follow'}
          </button>
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

        {/* Number of dives */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Total dives: </p>
          <p className="text-lg">{user.log_count}</p>
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

        {/* Dive centers */}
        {user.dive_centers && user.dive_centers.length > 0 && (
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Works at:</p>
            <div className='text-lg flex flex-col'>
              {user.dive_centers?.map((center) => (
                <Link
                  href={`/diveCenter/${center.id}`}
                  key={center.id}
                  className='hover:text-eyeCatchDark'
                >
                  {center.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='w-8/12 md:w-1/3 max-w-md mx-auto'>
        <Link
          href={`${pathName}/logBook`}
          className='w-fit ml-auto mr-2 px-2 py-1 rounded-md flex items-center justify-end bg-eyeCatchDark text-baseWhite shadow-sm hover:bg-eyeCatch'
        >
          Visit Logbook
          <IoIosArrowForward className='text-lg' />
        </Link>
      </div>

    </>
  );
}

export default BuddyDetailPage;