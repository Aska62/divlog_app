'use client';
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { RiUserFollowFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useDebouncedCallback } from 'use-debounce';
import { findDiveCenters , findDiveCentersReturn, isFindDiveCentersParams } from '@/actions/diveCenter/findDiveCenters';
import Heading from "@/components/Heading";
import CountryOptions from '@/components/CountryOptions';
import OrganizationOptions from '@/components/OrganizationOptions';
import DiveCenterCard from '@/components/diveCenter/DiveCenterCard';

const DiveCenterListPage = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const [diveCenters, setDiveCenters] = useState<findDiveCentersReturn>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(searchParams.get('name') || '');
  const [country, setCountry] = useState<string>(searchParams.get('country') || '');
  const [organization, setOrganization] = useState<string>(searchParams.get('organization') || '');

  const updateQueryParams = useDebouncedCallback(({name, value}: {name: string, value: string}) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        console.log('name')
        setName(value);
        break;
      case 'country':
        console.log('country')
        setCountry(value);
        break;
      case 'organization':
        console.log('org')
        setOrganization(value);
        break;
    }

    updateQueryParams({name, value});
  };

  // Clear
  const handleClear = (e:React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.replace(`${pathName}`);
    setName('');
    setCountry('');
    setOrganization('');
  }

  useEffect(() => {
    const getDiveCenters = async() => {
      setIsLoading(true);
      const params = {
        keyword: searchParams.get('name') || '',
        country: Number(searchParams.get('country')) || '',
        organization: Number(searchParams.get('organization')) || '',
        status: Number(searchParams.get('status')) || 1,
      }

      try {
        if (isFindDiveCentersParams(params)) {
          const record = await findDiveCenters(params)

          if (record) {
            setDiveCenters(record);
          } else {
            setDiveCenters([])
          }
        }
      } catch (error) {
        toast.error('Failed to find Dive Centers');
        console.log('error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getDiveCenters();
  }, [searchParams]);

  useEffect(() => {
    setName(searchParams.get('name') || '');
    setCountry(searchParams.get('country') || '');
    setOrganization(searchParams.get('organization') || '');
  }, [searchParams]);

  return (
    <>
      <Heading pageTitle="Dive Centers" />

      <form className="flex flex-col w-10/12 max-w-xl py-4 px-5 rounded-sm mx-auto my-6 shadow-dl">

        {/* Name */}
        <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            placeholder="Name"
            onChange={(e) => handleInputChange(e)}
            className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-full md:w-3/5 h-7 px-1 self-end md:ml-3 focus:outline-none"
          />
        </div>

        {/* Country */}
        <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
        <label htmlFor="country">Country/region</label>
          <select
            name="country"
            className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-full md:w-3/5 h-7 px-1 self-end md:ml-3 focus:outline-none"
            onChange={(e) => handleInputChange(e)}
            value={country}
          >
            <option value="">--- Please select ---</option>
            <CountryOptions />
          </select>
        </div>

        {/* Organization */}
        <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
          <label htmlFor="organization">Organization</label>
          <select
            name="organization"
            className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-full md:w-3/5 h-7 px-1 self-end md:ml-3 focus:outline-none"
            onChange={(e) => handleInputChange(e)}
            value={organization}
          >
            <option value="">--- Please select ---</option>
            <OrganizationOptions />
          </select>
        </div>

        {/* Follow status */}
        <div className="w-full flex flex-col md:flex-row md:justify-between mb-4">
          <p className="mr-12">Follow Status</p>
          <div className="flex items-center md:w-3/5 md:justify-between">
            <div className="mr-3">
              <input
                type="radio"
                name="status"
                id="all"
                value="1"
                onChange={(e) => handleInputChange(e)}
                checked={!searchParams.get('status') || searchParams.get('status')?.toString() === '1'}
              />
              <label htmlFor="all" className="ml-1">All</label>
            </div>
            <div className="mr-3 flex">
              <input
                type="radio"
                name="status"
                id="following"
                value="2"
                onChange={(e) => handleInputChange(e)}
                checked={searchParams.get('status')?.toString() === '2'}
              />
              <label htmlFor="nonDraft" className="flex items-center">
                <RiUserFollowFill />Following
              </label>
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


      <div className="flex flex-col items-center my-6">
        {isLoading ? (
          <p>Loading... </p>
        ) : diveCenters.length > 0 ? diveCenters.map((center) => {
          return (
            <DiveCenterCard
              diveCenter={center}
              my={6}
              key={center.id}
            />
          )
        }) : (
          <p>No matching center found</p>
        )}
      </div>
    </>
  );
}

export default DiveCenterListPage;