'use client';
import { useState, MouseEvent, useRef, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { RxCross2 } from "react-icons/rx";
import { useClickOutside } from "@/hooks/useClickOutside";
import isString from "@/utils/isString";
import { isDiveCenterHighLight} from '@/types/diveCenterTypes';
import { findUsers, FindUsersReturn, isUserHighLight } from "@/actions/user/findUsers";
import { findDiveCenters, FindDiveCentersReturn } from "@/actions/diveCenter/findDiveCenters";
import {
  ModalTypes,
  modalTypeBuddy,
  modalTypeSupervisor,
  modalTypeDiveCenter,
  ChoiceStateValue,
} from "@/app/logBook/[id]/edit/page";

type SearchModalProps = {
  type: ModalTypes | 0,
  setData: React.Dispatch<React.SetStateAction<Partial<ChoiceStateValue>>> | false;
  setIsModalVisible: React.Dispatch<React.SetStateAction<false>>;
}

const SearchModal:React.FC<SearchModalProps> = ({ type, setData, setIsModalVisible }) => {
  const targetName = type === modalTypeBuddy ? 'buddy'
    : type === modalTypeSupervisor ? 'supervisor'
    : type === modalTypeDiveCenter && 'dive center';

  const [options, setOptions] = useState<FindUsersReturn | FindDiveCentersReturn>([]);
  const [keyword, setKeyword] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  const onClickOutside = () => setIsModalVisible(false);
  useClickOutside(ref, onClickOutside);

  const handleSearch = useDebouncedCallback( async(val: string): Promise<void> => {
    try {
      const res = (type === modalTypeDiveCenter)
        ? await findDiveCenters({
          keyword: val,
          country: '',
          organization: '',
          status: 1,
        })
        : await findUsers({
          keyword: val,
          status: 1,
        })
      if (res) {
        setOptions(res);
      }
    } catch (error) {
      console.log('Error while fetching options: ', error);
    }
  }, 300);

  const handleKeywordChange = (val: string): void => {
    setKeyword(val);
    handleSearch(val);
  };

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

  useEffect(() => {
    handleSearch('');
  }, [handleSearch]);

  return (
    <div
      ref={ref}
      className="w-10/12 max-w-xl h-80 md:h-96 mx-auto mt-36 bg-baseWhite text-darkBlue shadow-dl rounded-md flex flex-col items-center relative"
    >
      <RxCross2
        onClick={() => setIsModalVisible(false)}
        className="absolute top-2 right-3 text-2xl hover:cursor-pointer hover:text-darkBlueLight duration-75"
      />
      <p className="text-center my-3 pt-3 font-bold text-lg">Find { targetName }</p>
      <input
        type="text"
        className="w-9/12 h-10 p-1 my-3 bg-lightBlue rounded-md focus:outline-none"
        placeholder="Find by name"
        value={keyword}
        onChange={(e) => handleKeywordChange(e.target.value)}
      />
      <div className="w-10/12 md:w-8/12 mx-auto my-3 overflow-y-scroll">
        { options.length > 0 && options.map((option) => (
          <div
            key={ option.id }
            className="mx-auto py-6 flex justify-between items-center hover:text-darkBlueLight"
          >
            <div className="flex flex-col items-start">
              {isDiveCenterHighLight(option) ? (
                <>
                  <p className="text-md">{ option.name }</p>
                  <p className="text-sm" >{ option.country }</p>
                </>
              ) : isUserHighLight(option) && (
                <>
                  <p className="text-md">{ option.license_name }</p>
                  <p className="text-sm">@{ option.divlog_name }</p>
                </>
              )}
            </div>
            <input type="hidden" name='id' value={option.id} />
            <button
              className="w-fit bg-white border border-darkBlue hover:bg-lightBlue duration-75 text-sm px-2 py-1 rounded-md"
              onClick={(e) => handleOptionClick({ e, id:option.id, name: isUserHighLight(option) ? option.divlog_name : isDiveCenterHighLight(option) ? option.name : '' })}
            >Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SearchModal;