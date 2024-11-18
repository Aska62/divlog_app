'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Heading from "@/components/Heading";
import LogCard from "@/components/log/LogCard";
import AddNewLogBtn from "@/components/log/AddNewLogBtn";
import CountryOptions from '@/components/CountryOptions';

const LogBokPage = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  // Date: from
  const handleDateFromChange = (val: string): void => {
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set('dateFrom', val);
    } else {
      params.delete('dateFrom');
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }

  // Date: to
  const handleDateToChange = (val: string): void => {
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set('dateTo', val);
    } else {
      params.delete('dateTo');
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }

   // Log no: from
  const handleLogNoFromChange = (val: string): void => {
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set('logNoFrom', val);
    } else {
      params.delete('logNoFrom');
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }

  // Log no: to
  const handleLogNoToChange = (val: string): void => {
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set('logNoTo', val);
    } else {
      params.delete('logNoTo');
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }

  // Country
  const handleCountryChange = (val: string): void => {
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set('country', String(val));
    } else {
      params.delete('country');
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }

  // Status
  const handleStatusChange = (val: string): void => {
    const params = new URLSearchParams(searchParams);

    if (val) {
      params.set('status', String(val));
    } else {
      params.delete('status');
    }

    router.replace(`${pathName}/?${params.toString()}`);
  }

  // Clear
  const handleClear = (): void => {
    router.replace(`${pathName}`);
  }

  return (
    <>
      <Heading pageTitle="Log Book" />
      <div className="w-10/12 max-w-xl mx-auto text-right">
        <AddNewLogBtn />
      </div>

      {/* <LogSearchForm /> */}
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
                onChange={(e) => handleDateFromChange(e.target.value)}
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
                onChange={(e) => handleDateToChange(e.target.value)}
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
                onChange={(e) => handleLogNoFromChange(e.target.value)}
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
                onChange={(e) => handleLogNoToChange(e.target.value)}
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
            onChange={(e) => handleCountryChange(e.target.value)}
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
                onChange={(e) => handleStatusChange(e.target.value)}
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
                onChange={(e) => handleStatusChange(e.target.value)}
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
                onChange={(e) => handleStatusChange(e.target.value)}
                checked={searchParams.get('status')?.toString() === '3'}
              />
              <label htmlFor="draft" className="ml-2">Draft</label>
            </div>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="self-end bg-lightGray dark:bg-lightBlue hover:bg-darkBlue dark:hover:bg-lightGray duration-75 text-baseWhite dark:text-baseBlack px-2 rounded-md"
        >
          Clear
        </button>
      </form>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center md:flex-row md:justify-center md:flex-wrap pt-4 pb-10">
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <div className="w-60 h-44 border border-darkBlue dark:border-lightBlue rounded-md shadow-dl mx-6 my-8 md:justify-self-end">
          last card
        </div>
      </div>
    </>
  );
}

export default LogBokPage;