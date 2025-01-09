'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { UUID } from "crypto";
import {
  findBuddysDiveRecords,
  FindBuddysDiveRecordsArray,
  isFindBuddysDiveRecordsArray
} from "@/actions/diveRecord/findBuddysDiveRecords";
import { getDivlogNameById } from '@/actions/user/getDivlogNameById';
import Heading from "@/components/Heading";
import LogCard from '@/components/log/LogCard';
import CountryOptions from '@/components/CountryOptions';

type BuddyDiveRecordListPageParams = {
  params: Promise<{ id: UUID }>
}

const BuddyDiveRecordListPage: React.FC<BuddyDiveRecordListPageParams> = ({ params }) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const [owner, setOwner] = useState<{
    id: UUID,
    divlog_name: string
  } | Record<string, never>>({});
  const [record, setRecord] = useState<FindBuddysDiveRecordsArray>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<string>(searchParams.get('dateFrom') || '');
  const [dateTo, setDateTo] = useState<string>(searchParams.get('dateTo') || '');
  const [logNoFrom, setLogNoFrom] = useState<string>(searchParams.get('logNoFrom') || '');
  const [logNoTo, setLogNoTo] = useState<string>(searchParams.get('logNoTo') || '');
  const [country, setCountry] = useState<string>(searchParams.get('country') || '');
  const [isMyBuddyDive, setIsMyBuddyDive] = useState<boolean>(!!searchParams.get('isMyBuddyDive'));
  const [isMyInstruction, setIsMyInstruction] = useState<boolean>(!!searchParams.get('isMyInstruction'));

  useEffect(() => {
    const fetchDiveRecord = async(userId: UUID) => {
      try {
        const res = await findBuddysDiveRecords({userId});

        setRecord(isFindBuddysDiveRecordsArray(res.data) ? res.data : []);
        setIsError(!!res.error);
      } catch (error) {
        console.log('Error in fetchDiveRecord', error);
        setIsError(true);
      }
    }

    const fetchRecordAndName = async() => {
      setIsLoading(true);
      const { id } = await params; // user id

      try {
        await getDivlogNameById(id)
        .then((res) => {
          fetchDiveRecord(id);
          setOwner({
            id,
            divlog_name: res?.divlog_name || ''
          });
        })
      } catch (error) {
        console.log('Error fetching divlog name', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecordAndName();
  }, [params]);

  const updateQueryParams = useDebouncedCallback(({name, value}: {name: string, value: string}) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }, 300);

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    let isBoolean = false;

    switch (name) {
      case 'dateFrom':
        setDateFrom(value);
        break;
      case 'dateTo':
        setDateTo(value);
        break;
      case 'logNoFrom':
        setLogNoFrom(value);
        break;
      case 'logNoTo':
        setLogNoTo(value);
        break;
      case 'country':
        setCountry(value);
        break;
      case 'isMyBuddyDive':
        setIsMyBuddyDive(!isMyBuddyDive);
        isBoolean = true;
        break;
      case 'isMyInstruction':
        setIsMyInstruction(!isMyInstruction);
        isBoolean = true;
        break;
    }

    updateQueryParams({name, value: isBoolean ? '' : value});
  }

  // Clear
  const handleClear = (e:React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.replace(`${pathName}`);
  }

  return (
    <>
      <Heading pageTitle={`${owner.divlog_name || 'Buddy'}'s Log Book`} />

      {/* Search form */}
      <form className="flex flex-col w-10/12 max-w-xl py-4 px-5 rounded-sm mx-auto my-6 shadow-dl">
        {/* Date */}
        <div className="w-full flex flex-col md:flex-row md:justify-between mb-4">
          <p>Date</p>
          <div className="w-full md:w-10/12 flex flex-col md:flex-row md:justify-between">
            <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
              <label htmlFor="dateFrom" className="text-sm pl-3 md:pl-0 md:px-1">From</label>
              <input
                type="date"
                name="dateFrom"
                placeholder="Date"
                className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-10/12 md:w-full px-1 focus:outline-none"
                onChange={(e) => handleInputChange(e)}
                value={dateFrom}
              />
            </div>
            <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
              <label htmlFor="dateTo" className="text-sm pl-3 md:pl-0 md:px-1">To</label>
              <input
                type="date"
                name="dateTo"
                placeholder="Date"
                className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-10/12 md:w-full px-1 focus:outline-none"
                onChange={(e) => handleInputChange(e)}
                value={dateTo}
              />
            </div>
          </div>
        </div>

        {/* Log No. */}
        <div className="w-full flex flex-col md:flex-row md:justify-between mb-4">
          <p className="w-fit m-0">Log No.</p>
          <div className="w-full md:w-10/12 flex flex-col md:flex-row md:justify-between">
            <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
              <label htmlFor="logNoFrom" className="text-sm pl-3 md:pl-0 md:px-1">From</label>
              <input
                type="number"
                name="logNoFrom"
                placeholder="Log no."
                className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-10/12 md:w-full px-1 focus:outline-none"
                onChange={(e) => handleInputChange(e)}
                value={logNoFrom}
              />
            </div>
            <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
              <label htmlFor="logNoTo" className="text-sm pl-3 md:pl-0 md:px-1">To</label>
              <input
                type="number"
                name="logNoTo"
                placeholder="Log no."
                className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-10/12 md:w-full px-1 focus:outline-none"
                onChange={(e) => handleInputChange(e)}
                value={logNoTo}
              />
            </div>
          </div>
        </div>

        <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
          <label htmlFor="country">Country/region</label>
          <select
            name="country"
            className="text-black bg-lightBlue dark:bg-baseWhite rounded-sm w-full md:w-3/5 h-7 self-end md:ml-3 focus:outline-none"
            onChange={(e) => handleInputChange(e)}
            value={country}
          >
            <option value="">--- Please select ---</option>
            <CountryOptions />
          </select>
        </div>

        {/* Involvement status */}
        <div className="w-full flex flex-col md:flex-row mb-4">
          <div className="mr-6">
            <input
              type="checkbox"
              name="isMyBuddyDive"
              id="isMyBuddyDive"
              value="1"
              onChange={(e) => handleInputChange(e)}
              checked={isMyBuddyDive}
            />
            <label htmlFor="isMyBuddyDive" className="ml-2">With me as a buddy</label>
          </div>
          <div className="mr-6">
            <input
              type="checkbox"
              name="isMyInstruction"
              id="isMyInstruction"
              value="1"
              onChange={(e) => handleInputChange(e)}
              checked={isMyInstruction}
            />
            <label htmlFor="isMyInstruction" className="ml-2">With me as a supervisor</label>
          </div>
        </div>

        <button
          onClick={(e) => handleClear(e)}
          className="self-end bg-lightGray dark:bg-lightBlue hover:bg-darkBlue dark:hover:bg-lightGray duration-75 text-baseWhite dark:text-baseBlack px-2 rounded-md"
        >
          Clear
        </button>
      </form>

      {/* Search result */}
      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12 ">
      {isError ? (
        <p>Error occurred</p>
      ) : isLoading ? (
        <p>Loading...</p>
        ) : record.length === 0 ? (
          <p>No dive record on DivLog</p>
        ) :
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center md:flex-row md:justify-center md:flex-wrap pt-4 pb-10">
            {record.map((r) => (
              <LogCard
                key={r.id}
                is_visitor={true}
                id={r.id}
                user_id={r.user_id}
                is_draft={false}
                log_no={r.log_no}
                date={r.date}
                location={r.location}
                country_name={r.country}
                is_my_buddy_dive={r.is_my_buddy_dive}
                is_my_instruction={r.is_my_instruction}
              />
            ))}
          </div>
        }
      </div>
    </>
  );
}

export default BuddyDiveRecordListPage;