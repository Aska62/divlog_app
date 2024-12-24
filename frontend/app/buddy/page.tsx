'use client';
import { useState, useEffect } from "react";
import { findUsers, FindUsersReturn } from "@/actions/user/findUsers";
import Heading from "@/components/Heading";
import BuddyCard from '@/components/buddies/BuddyCard';

const BuddyPage = () => {
  const [users, setUsers] = useState<FindUsersReturn>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const keyword = '';
      const status = 1;
      const users = await findUsers({keyword, status});

      if (users) {
        setUsers(users);
      } else {
        setUsers([]);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      <Heading pageTitle="Buddies" />
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

