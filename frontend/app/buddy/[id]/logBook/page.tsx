'use client';
import { useState, useEffect } from 'react';
import { UUID } from "crypto";
import {
  findBuddysDiveRecords,
  FindBuddysDiveRecordsArray,
  isFindBuddysDiveRecordsArray
} from "@/actions/diveRecord/findBuddysDiveRecords";
import { getDivlogNameById } from '@/actions/user/getDivlogNameById';
import Heading from "@/components/Heading";
import LogCard from '@/components/log/LogCard';

type BuddyDiveRecordListPageParams = {
  params: Promise<{ id: UUID }>
}

const BuddyDiveRecordListPage: React.FC<BuddyDiveRecordListPageParams> = ({ params }) => {
  const [owner, setOwner] = useState<{
    id: UUID,
    divlog_name: string
  } | Record<string, never>>({});
  const [record, setRecord] = useState<FindBuddysDiveRecordsArray>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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

  return (
    <>
      <Heading pageTitle={`${owner.divlog_name || 'Buddy'}'s Log Book`} />
      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12">

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