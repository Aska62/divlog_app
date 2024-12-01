'use client';
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { isDivePurposeType } from '@/types/divePurposeTypes';

export type DivePurposeOptionList = Array<{id: number, name: string}>

type DivePurposeOptionsProps = {
  setPurposeList?:  React.Dispatch<React.SetStateAction<DivePurposeOptionList>>
}

const DivePurposeOptions = ({ setPurposeList }: DivePurposeOptionsProps) => {
  const [purposes, setPurposes] = useState<DivePurposeOptionList>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/divePurposes`)
      .then((res) => {
        setPurposes(res.data);
        if (!!setPurposeList) {
          setPurposeList(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching purposes: ', err);
      })

  }, [setPurposeList]);

  const options = useMemo(() => {
    if (purposes.length > 0) {
      return purposes.map((purpose) => {
        if (isDivePurposeType(purpose)) {
          return (
            <option
              value={ purpose.id }
              key={ purpose.id }
            >
              { purpose.name }
            </option>
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