'use client';
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { isCountryType } from '@/types/countryTypes';

export type CountryOptionList = Array<{id: number, name: string}>

type CountryOptionsProps = {
  setCountryList?:  React.Dispatch<React.SetStateAction<CountryOptionList>>
}

const CountryOptions = ({ setCountryList }: CountryOptionsProps) => {
  const [countries, setCountries] = useState<CountryOptionList>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/countries`)
      .then((res) => {
        setCountries(res.data);
        if (!!setCountryList) {
          setCountryList(res.data);
        }
      })
      .catch((err) => {
        console.log('Error fetching countries: ', err);
      })

  }, [setCountryList]);

  const options = useMemo(() => {
    if (countries.length > 0) {
      return countries.map((country) => {
        if (isCountryType(country)) {
          return (
            <option
              value={ country.id }
              key={ country.id }
            >
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