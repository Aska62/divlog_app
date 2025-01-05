'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UUID } from 'crypto';
import isObjectEmpty from '@/utils/isObjectEmpty';
import { getDiveCenterInfo } from '@/actions/diveCenter/getDiveCenterInfo';
import { DiveCenter } from '@/types/diveCenterTypes';
import Heading from "@/components/Heading";

type DiveCenterPageParams = {
  params: Promise<{ id: UUID }>
}

const DiveCenterPage: React.FC<DiveCenterPageParams> = ({ params }) => {
  const [diveCenter, setDiveCenter] = useState<Partial<DiveCenter>>({});

  useEffect(() => {
    const getDiveCenter = async() => {
      const { id } = await params;

      const diveCenterInfo = await getDiveCenterInfo({diveCenterId: id});
      if (diveCenterInfo) {
        setDiveCenter(diveCenterInfo);
      }
    }

    if (isObjectEmpty(diveCenter)) {
      getDiveCenter();
    }
  }, [diveCenter, params]);

  return (
    <>
      <Heading pageTitle="Dive Center Profile" />
      <p>{diveCenter.name}</p>
      <p>{diveCenter.country}</p>
      <p>{diveCenter.organization}</p>
      <p>{diveCenter.follower_count}</p>
      <p>{diveCenter.is_following}</p>
      {diveCenter.staffs && diveCenter.staffs.length > 0 && diveCenter.staffs.map((staff) => (
        <Link href={`user/${staff.id}`} key={staff.id}>
          <p>{staff.license_name} @{staff.divlog_name}</p>
        </Link>
      ))}
    </>
  );
}

export default DiveCenterPage;