'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { UUID } from 'crypto';
import isObjectEmpty from '@/utils/isObjectEmpty';
import { getDiveCenterInfo } from '@/actions/diveCenter/getDiveCenterInfo';
import followDiveCenter from '@/actions/diveCenterFollow/followDiveCenter';
import unfollowDiveCenter from '@/actions/diveCenterFollow/unfollowDiveCenter';
import { DiveCenter } from '@/types/diveCenterTypes';
import Heading from "@/components/Heading";
import FollowIcon, { statusFollowing } from '@/components/buddies/FollowIcon';

type DiveCenterPageParams = {
  params: Promise<{ id: UUID }>
}

const DiveCenterPage: React.FC<DiveCenterPageParams> = ({ params }) => {
  const [diveCenter, setDiveCenter] = useState<Partial<DiveCenter>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const getDiveCenter = async() => {
      setIsLoading(true);
      setIsError(false);
      const { id } = await params;

      try {
        const diveCenterInfo = await getDiveCenterInfo({diveCenterId: id});
        if (diveCenterInfo) {
          setDiveCenter(diveCenterInfo);
        }
      } catch (error) {
        console.log('error:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (isObjectEmpty(diveCenter)) {
      getDiveCenter();
    }
  }, [diveCenter, params]);

  const onFollowBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (diveCenter.id) {
      try {
        const res = await followDiveCenter({diveCenterId: diveCenter.id});
        if (res.data) {
          setDiveCenter({...diveCenter, ...{
            is_following: true,
            follower_count: Number(diveCenter.follower_count) + 1
          }});
        } else {
          console.log('Error while trying to follow:', res.message);
        }
      } catch (error) {
        console.log('Error:', error)
        toast.error(`Failed to follow ${diveCenter.name}`);
      }
    }
  }

  const onUnFollowBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (diveCenter.id) {
      try {
        const res = await unfollowDiveCenter({diveCenterId: diveCenter.id});
        if (res.data) {
          setDiveCenter({...diveCenter, ...{
            is_following: false,
            follower_count: Number(diveCenter.follower_count) - 1
          }});
        } else {
          console.log('Error while trying to unfollow:', res.message)
        }
      } catch (error) {
        console.log('Error:', error)
        toast.error(`Failed to unfollow ${diveCenter.name}`);
      }
    }
  }

  return (
    <>
      <Heading pageTitle="Dive Center Profile" />

      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12">

        {isError ? (
          <p>Error occurred</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className='h-24 mb-6 flex flex-col items-end justify-end'>
              <div className='flex mb-3 items-end'>
                <p className='text-sm'>
                  {diveCenter.follower_count} {Number(diveCenter.follower_count) <=1 ? 'follower' : 'followers'}
                </p>
                {/* Follow icons */}
                <div className="w-12 flex justify-around ml-auto mr-0">
                  {diveCenter.is_following && <FollowIcon status={statusFollowing} />}
                </div>
              </div>

              {/* Follow/unfollow button */}
              <button
                type='button'
                onClick={(e) => {
                  if (diveCenter.is_following) {
                    onUnFollowBtnClick(e);
                  } else {
                    onFollowBtnClick(e);
                  }
                }}
                className={`${diveCenter.is_following ? 'bg-darkBlue dark:bg-lightBlue hover:bg-darkBlueLight dark:hover:bg-lightBlue text-lightBlue dark:text-darkBlue dark:hover:text-darkBlueLight' : 'bg-eyeCatchDark hover:bg-eyeCatch text-baseWhite'} h-8 w-20 px-2 py-1 rounded-md`}
              >
                {diveCenter.is_following ? 'Unfollow' : 'Follow'}
              </button>
            </div>

            <div className="items-baseline mb-12">
              <h3 className="text-lg"><strong>{diveCenter.name}</strong></h3>
            </div>

            <div className="items-baseline mb-12">
              <p className="text-sm mr-2">Country/Region: </p>
              <p className="text-lg">{diveCenter.country}</p>
            </div>

            <div className="items-baseline mb-12">
              <p className="text-sm mr-2">Organization: </p>
              <p className="text-lg">{diveCenter.organization}</p>
            </div>

            {diveCenter.staffs && diveCenter.staffs.length > 0 && (
              <div className="items-baseline mb-12">
                <p className="text-sm mr-2">Staffs: </p>
                <div className='w-full flex items-start'>
                  {diveCenter.staffs.map((staff) => (
                    <Link
                      href={`/buddy/${staff.id}`}
                      key={staff.id}
                      className='my-2 mx-3 py-2 px-3 rounded-md flex w-fit items-center hover:shadow-dl'
                    >
                      <div className="w-16 h-16 rounded-full bg-lightBlue mr-3"></div>
                      <div>
                        <p className="text-md">{staff.license_name}</p>
                        <p className='text-sm'>@{staff.divlog_name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </>
  );
}

export default DiveCenterPage;