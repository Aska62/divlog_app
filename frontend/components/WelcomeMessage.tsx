'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import isNumber from '@/utils/isNumber';
import isObjectEmpty from "@/utils/isObjectEmpty";
import formatDate from '@/utils/dateTime/formatDate';
import { isDiveRecord, DiveRecord } from '@/types/diveRecordTypes';

const WelcomeMessage = () => {
  const [logCount, setLogCount] = useState<number>(0);
  const [lastDive, setLastDive] = useState<Partial<DiveRecord>>({});

  useEffect(() => {
    const getLogData = async() => {
      const countRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/count`, { withCredentials: true });

      if (isNumber(countRes.data.total) && countRes.data.total > 0) {
        setLogCount(countRes.data.total);
      } else {
        setLogCount(0);
      }

      const lastRecordRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/last`, { withCredentials: true });

      if (isDiveRecord(lastRecordRes.data))  {
        setLastDive(lastRecordRes.data);
      } else {
        setLastDive({});
      }
    }

    getLogData();
  }, []);

  return (
    <div className="w-64 md:w-96 mx-auto my-24 md:mt-36 lg:mt-48 text-center hover:cursor-pointer hover:text-darkBlueLight duration-150">
      { lastDive && !isObjectEmpty(lastDive) ? (
        <>
          <p>The last dive was on</p>
          <p className="text-4xl py-2">{lastDive.date && formatDate(lastDive.date)}</p>
          <p className="text-l">at {lastDive.location}, {lastDive.country?.name}</p>
        </>
      ) : (
        <>
          <p>No Log recorded yet</p>
          <p className="text-4xl py-2">Log a dive today</p>
          <p className="text-l">on DivLog</p>
        </>
      )}
      { logCount > 0 && (
        <p className="pt-2">Total logged dive: <span className="text-xl">{logCount}</span></p>
      )}
    </div>
  );
}

export default WelcomeMessage;