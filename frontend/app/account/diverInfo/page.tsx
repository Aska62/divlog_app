'use client';
import { useState, useEffect } from 'react';
import { UNIT_IMPERIAL } from '@/constants/unit';
import { DiverInfoType } from '@/types/diverInfoTypes';
import { getDiverInfo } from '@/actions/getDiverInfo';
import { getRecordCount } from '@/actions/diveRecord/getRecordCount';
import Heading from "@/components/Heading";

const DiverInfoPage = () => {
  const [diverInfo, setDiverInfo] = useState<Partial<DiverInfoType>>({});
  const [loggedDiveCount, setLoggedDiveCount] = useState<number>(0);

  useEffect(() => {
    const fetchDiverInfo = async() => {
      const info = await getDiverInfo();
      if (info) {
        setDiverInfo(info);
      }

      const diveCount = await getRecordCount();
      if (diveCount?.recorded) {
        setLoggedDiveCount(diveCount.recorded);
      }
    }

    fetchDiverInfo();
  }, []);

  console.log('diverInfo', diverInfo)
  return (
    <>
      <Heading pageTitle="Diver Info" />

      <div className="w-1/2 md:w-1/4 max-w-sm h-fit mx-auto mt-6 mb-12">

        {/* Logged dive */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Logged dive: </p>
          <p className="text-lg">{loggedDiveCount}</p>
        </div>

        {/* Unrecorded dive */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Unrecorded dive: </p>
          <p className="text-lg">{diverInfo.norecord_dive_count}</p>
        </div>

        {/* Total dive */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Total number of dive: </p>
          <p className="text-lg">{(diverInfo.norecord_dive_count || 0) + loggedDiveCount}</p>
        </div>

        {/* Height */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Height: </p>
          <p className="text-lg">{diverInfo.height} <span className='text-sm'>{UNIT_IMPERIAL ? 'Inches' : 'cm'}</span></p>
        </div>

        {/* Weight */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Weight: </p>
          <p className="text-lg">{diverInfo.weight} <span className='text-sm'>{UNIT_IMPERIAL ? 'Pounds' : 'kg'}</span></p>
        </div>

        {/* Shoe */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Shoe size: </p>
          <p className="text-lg">{diverInfo.shoe} <span className='text-sm'>{UNIT_IMPERIAL ? 'Inches' : 'cm'}</span></p>
        </div>

        {/* Measurement unit */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Measurement unit: </p>
          <p className="text-lg">{diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Imperial' : 'Metric'}</p>
        </div>

        {/* Languages */}
        <div className="items-baseline mb-8">
          <p className="text-sm mr-2">Languages: </p>
          {diverInfo.languages && diverInfo.languages.length > 0 &&
            diverInfo.languages.map((lang) => (
              <p className="text-lg" key={lang}>{lang}</p>
            ))
          }
        </div>
      </div>
    </>
  );
}

export default DiverInfoPage;