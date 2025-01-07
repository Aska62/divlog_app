'use client';
import { useState, useEffect } from "react";
import isObjectEmpty from "@/utils/isObjectEmpty";
import formatDate from '@/utils/dateTime/formatDate';
import { isDiveRecordHighlight, DiveRecordHighlight } from '@/types/diveRecordTypes';
import { getRecordCount } from '@/actions/diveRecord/getRecordCount';
import { getMyLastRecord } from "@/actions/diveRecord/getMyLastRecord";

const WelcomeMessage = () => {
  const [logCount, setLogCount] = useState<number>(0);
  const [lastDive, setLastDive] = useState<Partial<DiveRecordHighlight>>({});

  useEffect(() => {
    const getLogData = async() => {
      const countRes = await getRecordCount();

      if (countRes?.total) {
        setLogCount(countRes.total);
      } else {
        setLogCount(0);
      }
    }

    const getLastRecord = async() => {
      const lastRecord = await getMyLastRecord();

      if (isDiveRecordHighlight(lastRecord))  {
        setLastDive(lastRecord);
      } else {
        setLastDive({});
      }
    }

    getLogData();
    getLastRecord();
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