'use client';
import { useState, useEffect } from 'react';
import axios from "axios";
import Heading from "@/components/Heading";

export type UserProfile = {
  id            : string,
  divlog_name   : string,
  license_name? : string,
  email         : string,
  certification?: string,
  cert_org_id?  : number,
}
const ProfilePage = () => {
  const [user, setUser] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const getUser = async() => {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        { withCredentials: true })
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.log('Error fetching user data:', error)
        });
    }
    getUser();
  }, []);

  return (
    <>
      <Heading pageTitle="Profile" />

      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto my-12">

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
          <p className="text-lg">{user.cert_org_id}</p>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;