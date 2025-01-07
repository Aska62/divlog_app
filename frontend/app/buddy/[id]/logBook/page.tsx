'use client';
import { useState, useEffect } from 'react';
import { UUID } from "crypto";
import { findBuddysDiveRecords, FindBuddysDiveRecordsArray, isFindBuddysDiveRecordsArray } from "@/actions/diveRecord/findBuddysDiveRecords";
import Heading from "@/components/Heading";

type BuddyDiveRecordListPageParams = {
  params: Promise<{ id: UUID }>
}

const BuddyDiveRecordListPage: React.FC<BuddyDiveRecordListPageParams> = ({ params }) => {
  const [logOwner, setLogOwner] = useState<{
    id: UUID | null,
    name: string | null
  }>({id: null, name: null });
  const [record, setRecord] = useState<FindBuddysDiveRecordsArray>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const getLogOwner = async() => {
      const { id } = await params; // user id
      // TODO: fetch owner's name (divlog name)
      setLogOwner({id, name: null});
    }

    if (!logOwner.id) {
      getLogOwner();
    }
  }, [logOwner.id, params]);

  useEffect(() => {
    const fetchDiveRecord = async() => {
      if (logOwner.id) {
        try {
          setIsLoading(true);
          const res = await findBuddysDiveRecords({userId: logOwner.id});
          setRecord(isFindBuddysDiveRecordsArray(res.data) ? res.data : []);
          setIsError(!!res.error);
        } catch (error) {
          console.log('Error in fetchDiveRecord', error);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log(' no owner id')
      }
    }

    fetchDiveRecord();
  }, [logOwner.id]);

  return (
    <>
      <Heading pageTitle={`${logOwner.name || 'Buddy'}'s Log Book`} />
      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12">

        {isError ? (
            <p>Error occurred</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : record.length === 0 ? (
            <p>No dive record on DivLog</p>) : record.map((r) => (
              <p key={r.id}>{r.log_no}</p>
            )
          )
        }
      </div>
    </>
  );
}

export default BuddyDiveRecordListPage;