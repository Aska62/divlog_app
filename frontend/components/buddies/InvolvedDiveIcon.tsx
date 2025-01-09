'use client';
import { useState } from 'react';
import { FaUserFriends } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";

export const isBuddy = 1;
export const isInstructor = 2;

type ParticipantIconProps = {
  type: 1 | 2,
}

const ParticipantIcon = ({type}: ParticipantIconProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <>
      <div
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        className={` h-6 w-6 text-sm relative}`}
      >
        { type === isBuddy ?
          <FaUserFriends
            className='h-5 w-5 text-eyeCatch absolute top-1 right-1' />
          : <GiTeacher className='h-5 w-5 text-eyeCatch absolute top-1 right-1' />
        }

        {showTooltip && (
          <div
            className={`bg-baseWhite text-darkBlue shadow-dl w-20 px-2 py-1 rounded-md absolute bottom-6 ${type === isBuddy ? 'right-4' : 'left-6'}`}>
            <p>{type === isBuddy ? 'You are a buddy' : 'You are a supervisor'}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ParticipantIcon;