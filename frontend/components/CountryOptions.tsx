'use client';
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import isObjectEmpty from "@/utils/isObjectEmpty";
import { isCountryType } from '@/types/countryTypes';

type CountryOptionsProps = {
  selected?: number
}

const CountryOptions = ({ selected } : CountryOptionsProps) => {
  const [countries, setCountries] = useState<Partial<{id: number, name: string}>>({});

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/countries`)
      .then((res) => {
        setCountries(res.data)
      })
      .catch((err) => {
        console.log('Error fetching countries: ', err);
      })

  }, []);

  const options = useMemo(() => {
    if (!isObjectEmpty(countries)) {
      return Object.entries(countries).map(([, country]) => {
        if (isCountryType(country)) {
          return (
            <option value={country.id} key={country.id} selected={ Number(country.id) === selected } >
              { country.name }
            </option>
          );
        }
      }
    )
    }
  }, [countries]);

  return (
    <>
      { options }
    </>
  );
};

export default CountryOptions;