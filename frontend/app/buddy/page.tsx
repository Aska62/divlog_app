'use client';
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { findUsers, FindUsersReturn, isFindUsersParams } from "@/actions/user/findUsers";
import Heading from "@/components/Heading";
import BuddyCard from '@/components/buddies/BuddyCard';

const BuddyPage = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const [users, setUsers] = useState<FindUsersReturn>([]);

  useEffect(() => {
    const getBuddies = async() => {
      const params = {
        keyword: searchParams.get('name') || '',
        status: Number(searchParams.get('status')) || 1,
      }

      if (isFindUsersParams(params)) {
        const users = await findUsers(params);
        if (users) {
          setUsers(users);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    }

    getBuddies();
  }, [searchParams]);

  //  Status
  const handleInputChange = useDebouncedCallback((e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const params = new URLSearchParams(searchParams);
    const { name, value } = e.target;

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }, 300);

  // Clear TODO:check
  const handleClear = (e:React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.replace(`${pathName}`);
  }

  return (
    <>
      <Heading pageTitle="Buddies" />

      <form className="flex flex-col w-10/12 max-w-xl py-4 px-5 rounded-sm mx-auto my-6 shadow-dl">

        {/* Name */}
        <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={searchParams.get('name') || ''}
            placeholder="Name"
            onChange={(e) => handleInputChange(e)}
            className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-full md:w-3/5 h-7 px-1 self-end md:ml-3 focus:outline-none"
          />
        </div>

        {/* Follow status */}
        <div className="w-full flex flex-col md:flex-row mb-4">
          <p className="mr-12">Follow Status</p>
          <div className="flex ">
            <div className="mr-6">
              <input
                type="radio"
                name="status"
                id="all"
                value="1"
                onChange={(e) => handleInputChange(e)}
                checked={!searchParams.get('status') || searchParams.get('status')?.toString() === '1'}
              />
              <label htmlFor="all" className="ml-2">All</label>
            </div>
            <div className="mr-6">
              <input
                type="radio"
                name="status"
                id="following"
                value="2"
                onChange={(e) => handleInputChange(e)}
                checked={searchParams.get('status')?.toString() === '2'}
              />
              <label htmlFor="nonDraft" className="ml-2">Following</label>
            </div>
            <div className="mr-6">
              <input
                type="radio"
                name="status"
                id="followed"
                value="3"
                onChange={(e) => handleInputChange(e)}
                checked={searchParams.get('status')?.toString() === '3'}
              />
              <label htmlFor="draft" className="ml-2">Followed</label>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => handleClear(e)}
          className="self-end bg-lightGray dark:bg-lightBlue hover:bg-darkBlue dark:hover:bg-lightGray duration-75 text-baseWhite dark:text-baseBlack px-2 rounded-md"
        >
          Clear
        </button>
      </form>

      <div className="flex flex-col items-center mt-6">
        { users ? users.map((user) => (
          <BuddyCard key={user.id} user={user} my={6} />
        )) : (
          <p>No users found</p>
        )}
      </div>
    </>
  );
}

export default BuddyPage;

