'use client';
import { useState, MouseEvent, useRef } from "react";
import { useDebouncedCallback } from 'use-debounce';
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { useClickOutside } from "@/hooks/useClickOutside";
import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isString from "@/utils/isString";
import {
  ModalTypes,
  modalTypeBuddy,
  modalTypeSupervisor,
  modalTypeDiveCenter,
  ChoiceStateValue,
} from "@/app/logBook/[id]/edit/page";

type UserOption = {
  id: string,
  divlog_name: string,
  license_name?: string,
}

const isUserOption = (val: unknown): val is UserOption => {
  if (!isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const keys = ['id', 'divLog_name', 'license_name'];
  const wrongEntry = Object.entries(val).filter(([k, v]) => !keys.includes(k) || !isString(v));

  return wrongEntry.length === 0;
}

type CountryName = { name: string };

const isCountryName = (val:unknown): val is CountryName => {
  if (!isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  return val['name'] && isString(val['name'])
}

type DiveCenterOption = {
  id: string,
  name: string,
  country?: CountryName,
}

const isDiveCenterOption = (val: unknown): val is DiveCenterOption => {
  if (!isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const mustKeys = ['id', 'name'];

  const wrongEntry = Object.entries(val).find(([k, v]) => {
    if (k === 'country') {
      return !isCountryName(v)
    }

    return (!mustKeys.includes(k) || !isString(v))

  });

  return !wrongEntry;
}

type SearchModalProps = {
  type: ModalTypes | 0,
  setData: React.Dispatch<React.SetStateAction<Partial<ChoiceStateValue>>> | false;
  setIsModalVisible: React.Dispatch<React.SetStateAction<false>>;
}

const SearchModal:React.FC<SearchModalProps> = ({ type, setData, setIsModalVisible }) => {
  const target = type === modalTypeBuddy ? 'buddy'
    : type === modalTypeSupervisor ? 'supervisor'
    : type === modalTypeDiveCenter && 'dive center';

  const [options, setOptions] = useState<UserOption[] | DiveCenterOption[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const onClickOutside = () => setIsModalVisible(false);
  useClickOutside(ref, onClickOutside);


  const handleKeywordChange = useDebouncedCallback( async(val: string): Promise<void> => {
    if (type > 0) {
      const targetKey = type === modalTypeDiveCenter ? 'diveCenters' : 'users';

      if (val) {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/${targetKey}/find/${val}`,
          { withCredentials: true }
        ).then((res) => {
          setOptions(res.data);
        })
        .catch((err) => {
          console.log('Error while fetching options: ', err);
        });

      }
    }
  }, 500);

  type HandleOptionClick = {
    e: MouseEvent<HTMLButtonElement>,
    id: string,
    name: string,
  }

  const handleOptionClick = ({e, id, name}: HandleOptionClick) => {
    e.preventDefault();

    if (isString(id) && setData) {
      setData({id, name});
    }

    setIsModalVisible(false);
  }

  return (
    <div
      ref={ref}
      className="w-10/12 max-w-xl h-80 md:h-96 mx-auto mt-36 bg-baseWhite text-darkBlue shadow-dl rounded-md flex flex-col items-center relative"
    >
      <RxCross2
        onClick={() => setIsModalVisible(false)}
        className="absolute top-2 right-3 text-2xl hover:cursor-pointer hover:text-darkBlueLight duration-75"
      />
      <p className="text-center my-3 pt-3 font-bold text-lg">Find { target }</p>
      <input
        type="text"
        className="w-9/12 h-10 p-1 my-3 bg-lightBlue rounded-md focus:outline-none"
        placeholder="Find by name"
        onChange={(e) => handleKeywordChange(e.target.value)}
      />
      <div className="w-10/12 md:w-8/12 mx-auto my-3 overflow-y-scroll">
        { options.length > 0 && options.map((option) => (
          <div
            key={ option.id }
            className="mx-auto py-6 flex justify-between items-center hover:text-darkBlueLight"
          >
            <div className="flex flex-col items-start">
              {isDiveCenterOption(option) ? (
                <>center da
                  <p className="text-md">{ option.name }</p>
                  <p className="text-sm" >{ option.country?.name }</p>
                </>
              ) : (
                <>
                  <p className="text-md">{ option.license_name }</p>
                  <p className="text-sm">@{ option.divlog_name }</p>
                </>
              )}
            </div>
            <input type="hidden" name='id' value={option.id} />
            <button
              className="w-fit bg-white border border-darkBlue hover:bg-lightBlue duration-75 text-sm px-2 py-1 rounded-md"
              onClick={(e) => handleOptionClick({ e, id:option.id, name: isDiveCenterOption(option) ? option.name : option.divlog_name })}
            >Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SearchModal;