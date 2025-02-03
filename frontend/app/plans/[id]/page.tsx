'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { UUID } from 'crypto';
import { getMyDivePlanById } from '@/actions/divePlan/getMyDivePlanById';
import { DivePlanDetail, isDivePlanDetail } from '@/types/divePlanTypes';
import formatDate from "@/utils/dateTime/formatDate";
import formatTime from '@/utils/dateTime/formatTime';
import Heading from "@/components/Heading";
import EditLogBtn from "@/components/log/EditLogBtn";

type PlanDetailPageProps = {
  params: Promise<{ id: UUID }>
}

const PlanDetailPage:React.FC<PlanDetailPageProps> = ({ params }) => {
  const [divePlan, setDivePlan] = useState<Partial<DivePlanDetail>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchLogRecord = async () => {
      setIsLoading(true);
      try {
        const { id } = await params;
        const res = await getMyDivePlanById(id);
        if (isDivePlanDetail(res)) {
          setDivePlan(res);
          setIsError(false)
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.log('Error:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogRecord();
  }, [params]);

  return (
    <>
      <Heading pageTitle={`Dive Plan`} />
      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mb-12">
        {isError ? (
          <p>Error occurred</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : divePlan && isDivePlanDetail(divePlan) ? (
          <>
            <div className="text-end mb-4">
            <EditLogBtn id={divePlan.id} isPlan={true} />
          </div>

          {/* Date */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Date: </p>
            <p className="text-lg">{ formatDate(divePlan.date) }</p>
          </div>

          {/* Location + Country/region */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Location: </p>
            <p className="text-lg">{ divePlan.location || '-' }, { divePlan.country?.name || '-' }</p>
          </div>

          {/* Purpose */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Purpose: </p>
            <p className="text-lg">{ divePlan.purpose?.name || '-' }</p>
          </div>

          {/* Course */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Course: </p>
            <p className="text-lg">{ divePlan.course || '-' }</p>
          </div>

          {/* Start time */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-1">Start time:</p>
            <p className="text-lg">{ divePlan.start_time ? formatTime(divePlan.start_time) : '--:--'}</p>
          </div>

          {/* Weight */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Added weight: </p>
            <p className="text-lg">{ divePlan.added_weight ? divePlan.added_weight : '-' } kg</p>
          </div>

          {/* Suit */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Suit: </p>
            <p className="text-lg">{ divePlan.suit }</p>
          </div>

          {/* Max depth */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Max depth: </p>
            <p className="text-lg">{ divePlan.max_depth ? divePlan.max_depth : '-' } m</p>
          </div>

          {/* Buddy */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Buddy: </p>
            { divePlan.buddy ? (
              <Link
                href={`/user/${divePlan.buddy.id}`}
                className="text-lg hover:text-eyeCatch"
              >
                  { divePlan.buddy.divlog_name }
              </Link>
            ) : (
              <p className="text-lg">
                { divePlan.buddy_str ? divePlan.buddy_str : '-' }
              </p>
            )}
          </div>

          {/* Supervisor */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Supervisor: </p>
            { divePlan.supervisor ? (
              <Link
                href={`/user/${divePlan.supervisor.id}`}
                className="text-lg hover:text-eyeCatch"
              >
                  { divePlan.supervisor.divlog_name }
              </Link>
            ) : (
              <p className="text-lg">
                { divePlan.supervisor_str ? divePlan.supervisor_str : '-' }
              </p>
            )}
          </div>

          {/* Dive center */}
          <div className="items-baseline mb-8">
            <p className="text-sm mr-2">Dive center: </p>
            {divePlan.dive_center ? (
              <Link
                href={`/diveCenter/${divePlan.dive_center.id}`}
                className="text-lg hover:text-eyeCatch"
              >
                  { divePlan.dive_center.name }
              </Link>
            ) : (
              <p className="text-lg">
                { divePlan.dive_center_str ? divePlan.dive_center_str : '-' }
              </p>
            )}
          </div>

          {/* Note */}
          <div className="mb-8">
            <p className="text-sm">Note: </p>
            <p className="text-md">
              { divePlan.notes || '-' }
            </p>
          </div>
          </>
        ) : (
          <p>Dive plan not found</p>
        )}
      </div>
    </>
  );
}

export default PlanDetailPage;