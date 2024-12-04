'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import axios from "axios";
import { DiveRecordDetail, isDiveRecordDetail } from '@/types/diveRecordTypes';
import formatDate from "@/utils/dateTime/formatDate";
import formatTime from '@/utils/dateTime/formatTime';
import calculateTimeGap from '@/utils/dateTime/calculateTimeGap';
import Heading from "@/components/Heading";
import EditLogBtn from "@/components/log/EditLogBtn";

type LogPageProps = {
  params: Promise<{ id: string }>
}

const LogPage:React.FC<LogPageProps> = ({ params }) => {
  const [diveRecord, setDiveRecord] = useState<Partial<DiveRecordDetail>>({});

  useEffect(() => {
    const fetchLogRecord = async () => {
      const { id } = await params;
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/${id}`,
        { withCredentials: true })
        .then((res) => {
          setDiveRecord(res.data);
        })
        .catch((err) => {
          console.log('Error fetching dive records: ', err);
          setDiveRecord({});
        });
    }

    fetchLogRecord();
  }, [params]);

  return (
    <>
    { diveRecord && isDiveRecordDetail(diveRecord) ? (
      <>
        <Heading pageTitle={`Log No. ${diveRecord.log_no}`} />

        <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mb-12">
          <div className={`${diveRecord.is_draft ? "flex justify-between items-center" : "text-end"} mb-4`}>
            { diveRecord.is_draft && (<p className="w-1/2 bg-eyeCatchDark text-baseWhite text-center font-bold px-2 mt-3">This is DRAFT</p>)}
            <EditLogBtn id={diveRecord.id} />
          </div>

          {/* Date */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Date: </p>
            <p className="text-lg">{ formatDate(diveRecord.date) }</p>
          </div>

          {/* Location + Country/region */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Location: </p>
            <p className="text-lg">{ diveRecord.location || '-' }, { diveRecord.country?.name || '-' }</p>
          </div>

          {/* Purpose */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Purpose: </p>
            <p className="text-lg">{ diveRecord.purpose?.name || '-' }</p>
          </div>

          {/* Course */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Course: </p>
            <p className="text-lg">{ diveRecord.course || '-' }</p>
          </div>

          {/* Weather */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Weather: </p>
            <p className="text-lg">{ diveRecord.weather || '-' }</p>
          </div>

          {/* Surface temperature */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Surface temperature:</p>
            <p className="text-lg">{ diveRecord.surface_temperature ? diveRecord.surface_temperature : '-'} &#176;C</p>
          </div>

          {/* Water temperature */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Water temperature:</p>
            <p className="text-lg">{ diveRecord.water_temperature ? diveRecord.water_temperature : '-' } &#176;C</p>
          </div>

          {/* Start time */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-1">Start time:</p>
            <p className="text-lg">{ diveRecord.start_time ? formatTime(diveRecord.start_time) : '--:--'}</p>
          </div>

           {/* End time */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-1">End time: </p>
            <p className="text-lg">{ diveRecord.end_time ? formatTime(diveRecord.end_time) : '--:--'}</p>
          </div>

          {/* Duration */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-1">Duration:</p>
            { diveRecord.start_time && diveRecord.end_time ?
              <p className="text-lg">{`${calculateTimeGap(diveRecord.start_time, diveRecord.end_time)} mins`}</p>
              : <p className="text-lg">-</p>
            }
          </div>

          {/* Tank pressure start */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-1">Start </p>
            <p className="text-lg">{ diveRecord.tankpressure_start ? diveRecord.tankpressure_start : '-'}</p>
          </div>

          {/* Tank pressure end */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-1">End </p>
            <p className="text-lg">{ diveRecord.tankpressure_end ? diveRecord.tankpressure_end : '-'}</p>
          </div>

          {/* Weight */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Added weight: </p>
            <p className="text-lg">{ diveRecord.added_weight ? diveRecord.added_weight : '-' } kg</p>
          </div>

          {/* Suit */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Suit: </p>
            <p className="text-lg">{ diveRecord.suit }</p>
          </div>

          {/* Max depth */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Max depth: </p>
            <p className="text-lg">{ diveRecord.max_depth ? diveRecord.max_depth : '-' } m</p>
          </div>

          {/* Visibility */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Visibility: </p>
            <p className="text-lg">{ diveRecord.visibility ? diveRecord.visibility : '-' } m</p>
          </div>

          {/* Buddy */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Buddy: </p>
            { diveRecord.buddy ? (
              <Link
                href={`/user/${diveRecord.buddy.id}`}
                className="text-lg hover:text-eyeCatch"
              >
                  { diveRecord.buddy.divlog_name }
              </Link>
            ) : (
              <p className="text-lg">
                { diveRecord.buddy_str ? diveRecord.buddy_str : '-' }
              </p>
            )}
          </div>

          {/* Supervisor */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Supervisor: </p>
            { diveRecord.supervisor ? (
              <Link
                href={`/user/${diveRecord.supervisor.id}`}
                className="text-lg hover:text-eyeCatch"
              >
                  { diveRecord.supervisor.divlog_name }
              </Link>
            ) : (
              <p className="text-lg">
                { diveRecord.supervisor_str ? diveRecord.supervisor_str : '-' }
              </p>
            )}
          </div>

          {/* Dive center */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Dive center: </p>
            {diveRecord.dive_center ? (
              <Link
                href={`/diveCenter/${diveRecord.dive_center.id}`}
                className="text-lg hover:text-eyeCatch"
              >
                  { diveRecord.dive_center.name }
              </Link>
            ) : (
              <p className="text-lg">
                { diveRecord.dive_center_str ? diveRecord.dive_center_str : '-' }
              </p>
            )}
          </div>

          {/* Note */}
          <div className="mb-8">
            <p className="text-sm">Note: </p>
            <p className="text-md">
              { diveRecord.notes || '-' }
            </p>
          </div>
        </div>
      </>
    ) : (
      <>
        Loading...
      </>
    )}
    </>
  );
}

export default LogPage;