'use client';
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { isDiveRecordHighlightArray, DiveRecordHighlight } from '@/types/diveRecordTypes';
import { findMyDiveRecords } from '@/actions/diveRecord/findMyDiveRecords';
import Heading from "@/components/Heading";
import LogCard from "@/components/log/LogCard";
import AddNewLogBtn from "@/components/log/AddNewLogBtn";
import CountryOptions from '@/components/CountryOptions';

const LogBokPage = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const [diveRecords, setDiveRecords] = useState<[DiveRecordHighlight?]>([]);
  // TODO:test
  const handleInputChange = useDebouncedCallback((e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const params = new URLSearchParams(searchParams);
    const { name, value } = e.target;

    if (name) {
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      router.replace(`${pathName}/?${params.toString()}`);
    }
  }, 300);

  // Clear
  const handleClear = (e:React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.replace(`${pathName}`);
  }

  useEffect(() => {
    const getLogData = async() => {
      const dateFrom = searchParams.get('dateFrom')?.toString();
      const dateTo = searchParams.get('dateTo')?.toString();
      const logNoFrom = searchParams.get('logNoFrom')?.toString();
      const logNoTo = searchParams.get('logNoTo')?.toString();
      const country = searchParams.get('country')?.toString();
      const status = searchParams.get('status')?.toString();

      const record = await findMyDiveRecords({dateFrom, dateTo, logNoFrom, logNoTo, country, status})

      if (isDiveRecordHighlightArray(record)) {
        setDiveRecords(record);
      } else {
        setDiveRecords([])
      }
    }

    getLogData();
  }, [searchParams]);

  return (
    <>
      <Heading pageTitle="Log Book" />
      <div className="w-10/12 max-w-xl mx-auto text-right">
        <AddNewLogBtn />
      </div>

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
                defaultValue={searchParams.get('dateFrom')?.toString()}
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
                defaultValue={searchParams.get('dateTo')?.toString()}
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
                defaultValue={searchParams.get('logNoFrom')?.toString()}
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
                defaultValue={searchParams.get('logNoTo')?.toString()}
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
            defaultValue={searchParams.get('country')?.toString()}
          >
            <option value="">--- Please select ---</option>
            <CountryOptions />
          </select>
        </div>

        {/* Log status */}
        <div className="w-full flex flex-col md:flex-row mb-4">
          <p className="mr-12">Status</p>
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
                id="nonDraft"
                value="2"
                onChange={(e) => handleInputChange(e)}
                checked={searchParams.get('status')?.toString() === '2'}
              />
              <label htmlFor="nonDraft" className="ml-2">Non-Draft</label>
            </div>
            <div className="mr-6">
              <input
                type="radio"
                name="status"
                id="draft"
                value="3"
                onChange={(e) => handleInputChange(e)}
                checked={searchParams.get('status')?.toString() === '3'}
              />
              <label htmlFor="draft" className="ml-2">Draft</label>
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

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center md:flex-row md:justify-center md:flex-wrap pt-4 pb-10">
        { isDiveRecordHighlightArray(diveRecords) && diveRecords.length > 0 ?
          diveRecords.map((record) => (
            <LogCard
              key={record.id}
              id={record.id}
              log_no={record.log_no}
              date={record.date}
              location={record.location}
              is_draft={record.is_draft}
              country_name={record.country?.name}
            />
          )
        ) : (
          <div>No dive logged on DivLog</div>
        )}
      </div>
    </>
  );
}

export default LogBokPage;