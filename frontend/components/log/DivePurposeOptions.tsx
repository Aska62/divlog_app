'use client';
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import isObjectEmpty from "@/utils/isObjectEmpty";
import { isDivePurposeType } from '@/types/divePurposeTypes';

const DivePurposeOptions = () => {
  const [purposes, setPurposes] = useState<Partial<{id: number, name: string}>>({});

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/divePurposes`)
      .then((res) => {
        setPurposes(res.data)
      })
      .catch((err) => {
        console.log('Error fetching purposes: ', err);
      })

  }, []);

  const options = useMemo(() => {
    if (!isObjectEmpty(purposes)) {
      return Object.entries(purposes).map(([, purpose]) => {
        if (isDivePurposeType(purpose)) {
          return (
            <option value={purpose.id} key={purpose.id}>{ purpose.name }</option>
          );
        }
      }
    )
    }
  }, [purposes]);

  return (
    <>
      { options }
    </>
  );
};

export default DivePurposeOptions;