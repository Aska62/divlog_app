'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import Heading from "@/components/Heading";
import EditAccountBtn from '@/components/account/EditAccountBtn';
import { getUserProfile, UserProfile } from '@/actions/user/getUserProfile';

const ProfilePage = () => {
  const [user, setUser] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const getUser = async() => {
      const user = await getUserProfile();
      if (user) {
        setUser(user);
      }
    }
    getUser();
  }, []);

  return (
    <>
      <Heading pageTitle="Profile" />

      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12">
        <div className='w-full text-end mb-3'>
          <EditAccountBtn accountDataType={1} />
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

      <div className='w-8/12 md:w-1/3 max-w-md mx-auto'>
        <Link
          href='/account/diverInfo'
          className='w-fit ml-auto mr-2 px-2 py-1 rounded-md flex items-center justify-end bg-lightBlue dark:text-baseBlack shadow-sm hover:text-darkBlueLight'
        >
          Diver Info
          <IoIosArrowForward className='text-lg' />
        </Link>
      </div>
    </>
  );
}

export default ProfilePage;