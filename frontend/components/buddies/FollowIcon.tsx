'use client';
import { useState } from 'react';
import { RiUserFollowFill, RiUserFollowLine } from "react-icons/ri";

export const statusFollowing = 1;
export const statusFollowed = 2;

type FollowIconProps = {
  status: 1 | 2,
}

const FollowIcon = ({status}: FollowIconProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <>
      <div
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        className={`h-12 w-6 flex flex-col-reverse text-sm ${status === statusFollowing ? 'items-end' : 'items-start'}`}
      >
        { status === statusFollowing ?
          <RiUserFollowFill
          className='h-5 w-5' />
          : <RiUserFollowLine className='h-5 w-5' />
        }

        {showTooltip && (
          <div
            className='shadow-dl px-2 py-1 rounded-md'>
            <p>{status === statusFollowing ? 'Following' : 'Followed'}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default FollowIcon;