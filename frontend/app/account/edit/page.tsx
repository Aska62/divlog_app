'use client';
import { useState, useEffect } from 'react';
import Heading from "@/components/Heading";
import { getUserProfile, UserProfile } from '@/actions/user/getUserProfile';

const EditProfilePage = () => {
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
      <Heading pageTitle="Edit Profile" />
    </>
  );
}

export default EditProfilePage;