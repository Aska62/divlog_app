'use client';
import { useState, useEffect } from 'react';
import { UUID } from "crypto";
import { findBuddysDiveRecords, FindBuddysDiveRecordsArray, isFindBuddysDiveRecordsArray } from "@/actions/diveRecord/findBuddysDiveRecords";
import Heading from "@/components/Heading";
import LogCard from '@/components/log/LogCard';

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
              <LogCard
                key={r.id}
                id={r.id}
                user_id={r.user_id}
                is_draft={false}
                log_no={r.log_no}
                date={r.date}
                location={r.location}
                country_name={r.country}
                is_my_buddy_dive={r.is_my_buddy_dive}
                is_my_instruction={r.is_my_instruction}
                is_visitor={true}
              />
          ))
        }
      </div>
    </>
  );
}

export default BuddyDiveRecordListPage;