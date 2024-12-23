'use client';
import React, { useState, useEffect, useActionState } from 'react';
import { toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";
import { BsPlusCircle } from "react-icons/bs";
import { DiverInfoType, DiverInfoInputFields } from '@/types/diverInfoTypes';
import { getDiverInfo } from '@/actions/diverInfo/getDiverInfo';
import updateDiverInfo from '@/actions/diverInfo/updateDiverInfo';
import { getRecordCount } from '@/actions/diveRecord/getRecordCount';
import Heading from "@/components/Heading";
import isNumString from '@/utils/isNumString';
import InputField from '@/components/diverInfo/InputField';
import SaveCancelBtn from '@/components/diverInfo/SaveCancelBtn';

const DiverInfoPage = () => {
  const [diverInfo, setDiverInfo] = useState<Partial<DiverInfoType>>({});
  const [diverInfoInDb, setDiverInfoInDb] = useState<Partial<DiverInfoType>>({});
  const [langInputs, setLangInputs] = useState<string[]>([]);
  const [loggedDiveCount, setLoggedDiveCount] = useState<number>(0);
  const [editing, setEditing] = useState<DiverInfoInputFields | ''>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [state, formAction, isPending] = useActionState(updateDiverInfo, {});

  useEffect(() => {
    const fetchDiverInfo = async() => {
      setLoading(true);
      const info = await getDiverInfo();
      if (info) {
        setDiverInfo(info);
        setDiverInfoInDb(info);
        if (Array.isArray(info.languages) && info.languages.length > 0) {
          setLangInputs(info.languages);
        }
      }

      const diveCount = await getRecordCount();
      if (diveCount?.recorded) {
        setLoggedDiveCount(diveCount.recorded);
      }
    }

    fetchDiverInfo()
    .then(() => setLoading(false));

  }, []);

  const handleEditStatus = (e:React.MouseEvent, type?:DiverInfoInputFields) => {
    e.preventDefault();
    setEditing(type || '');
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const {id, name, value} = e.target;

    if (name === 'lang') {
      const langId = id.slice(id.indexOf('_') + 1);
      if (isNumString(langId)) {
        const newLangArr = langInputs;
        newLangArr[Number(langId)] = value;
        setDiverInfo({...diverInfo, ...{languages: newLangArr}});
      }
    } else {
      const newVal = !!value ?  Number(value) : undefined;
      setDiverInfo({...diverInfo, ...{[name]: newVal}});
    }
  }

  const addLangInput = (index: number):void => {
    setLangInputs((prev) => {
      const updatedLangs = [...prev];
      updatedLangs.splice(index + 1, 0, '');
      setDiverInfo({...diverInfo, ...{languages: updatedLangs}});
      return updatedLangs;
    });
  };

  const deleteLangInput = (index:number):void => {
    if (langInputs.length > 1) {
      setLangInputs((prev) => {
        const updatedLangs = [...prev];
        updatedLangs.splice(index, 1);
        setDiverInfo({...diverInfo, ...{languages: updatedLangs}});
        return updatedLangs;
      });
    }
  }

  const onCancelClick = (e:React.MouseEvent) => {
    e.preventDefault();
    setEditing('');
    setDiverInfo(diverInfoInDb);
    setLangInputs(diverInfoInDb.languages || []);
  }

  useEffect(() => {
    if (state.data) {
      setEditing('');
      setDiverInfoInDb(state.data)
      toast.success('Profile successfully updated');
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <Heading pageTitle="Diver Info" />
      {loading ?
        <p>Loading...</p> :
        <form action={formAction} className="w-2/3 max-w-sm h-fit mx-auto mt-6 mb-12">
          {diverInfo.id && <input type="hidden" name='id' value={diverInfo.id} />}

          {/* Logged dive */}
          <div className="items-baseline my-14 md:flex">
            <p className="text-sm mr-4 md:w-36">Logged dive: </p>
            <p className="text-lg">{loggedDiveCount}</p>
          </div>

          {/* Unrecorded dive */}
          <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
            <InputField
              field='norecord_dive_count'
              editing={editing}
              isPending={isPending}
              handleInputChange={handleInputChange}
              measurementUnit={diverInfo.measurement_unit}
              value={diverInfo.norecord_dive_count}
            />
            <SaveCancelBtn
              field='norecord_dive_count'
              editing={editing}
              isPending={isPending}
              onCancelClick={onCancelClick}
              handleEditStatus={handleEditStatus}
            />
          </div>

          {/* Total dive */}
          <div className="items-baseline mb-14 md:flex">
            <p className="text-sm mr-4 md:w-36">Total number of dive: </p>
            <p className="text-lg">{(diverInfo.norecord_dive_count || 0) + loggedDiveCount}</p>
          </div>

          {/* Height */}
          <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
            <InputField
              field='height'
              editing={editing}
              isPending={isPending}
              handleInputChange={handleInputChange}
              measurementUnit={diverInfo.measurement_unit}
              value={diverInfo.height}
            />
            <SaveCancelBtn
              field='height'
              editing={editing}
              isPending={isPending}
              onCancelClick={onCancelClick}
              handleEditStatus={handleEditStatus}
            />
          </div>

          {/* Weight */}
          <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
            <InputField
              field='weight'
              editing={editing}
              isPending={isPending}
              handleInputChange={handleInputChange}
              measurementUnit={diverInfo.measurement_unit}
              value={diverInfo.weight}
            />
            <SaveCancelBtn
              field='weight'
              editing={editing}
              isPending={isPending}
              onCancelClick={onCancelClick}
              handleEditStatus={handleEditStatus}
            />
          </div>

          {/* Shoe */}
          <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
            <InputField
              field='shoe'
              editing={editing}
              isPending={isPending}
              handleInputChange={handleInputChange}
              measurementUnit={diverInfo.measurement_unit}
              value={diverInfo.shoe}
            />
            <SaveCancelBtn
              field='shoe'
              editing={editing}
              isPending={isPending}
              onCancelClick={onCancelClick}
              handleEditStatus={handleEditStatus}
            />
          </div>

          {/* Measurement unit TODO:bug: ib is not selectable */}
          <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
            <InputField
              field='measurement_unit'
              editing={editing}
              isPending={isPending}
              handleInputChange={handleInputChange}
              measurementUnit={diverInfo.measurement_unit}
              value={diverInfo.measurement_unit}
            />
            <SaveCancelBtn
              field='measurement_unit'
              editing={editing}
              isPending={isPending}
              onCancelClick={onCancelClick}
              handleEditStatus={handleEditStatus}
            />
          </div>

          {/* Languages */}
          <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
            <div className='w-full md:flex md:justify-between'>
              <label
                htmlFor="languages"
                className='text-sm mr-2 md:mt-2 md:w-36'
              >Languages:</label>

              <div className='flex flex-col md:flex-row'>
                <div className='flex justify-stretch items-end w-full'>
                  <div>
                    <input type="hidden" name='languages' value={diverInfo.languages || []} />
                    {langInputs.length > 0 ?
                      langInputs.map((lang, index) => (
                        <div key={index} className='flex justify-stretch'>
                          <input
                            type="text"
                            name='lang'
                            id={`lang_${index}`}
                            value={lang}
                            onChange={(e) => handleInputChange(e)}
                            disabled={editing !== 'languages' || isPending}
                            className={`${editing === 'languages' ? 'bg-lightBlue dark:text-baseBlack w-full' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-48'} dark:text-baseBlack focus:outline-none px-2 py-1 mb-1 rounded-sm`}
                          />
                          <div className={`${editing === 'languages' ? 'flex' : 'hidden'} `}>
                            <RxCross2
                              onClick={() => deleteLangInput(index)}
                              className="text-baseBlack dark:text-lightBlue h-5 w-5 mx-2 hover:cursor-pointer hover:text-eyeCatchDark"
                            />
                            <BsPlusCircle
                              onClick={() => addLangInput(index)}
                              className="text-baseBlack dark:text-lightBlue h-5 w-5 mx-2 hover:cursor-pointer hover:text-eyeCatchDark"
                            />
                          </div>
                        </div>
                      )): (
                        <div className='flex justify-stretch'>
                          <input
                            type="text"
                            name='lang'
                            id='lang_0'
                            value={langInputs[0]}
                            onChange={(e) => {if (editing === 'languages') handleInputChange(e)}}
                            disabled={editing !== 'languages' || isPending}
                            className={`${editing === 'languages' ? 'bg-lightBlue dark:text-baseBlack' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-44'} dark:text-baseBlack focus:outline-none px-2 py-1 mb-1 rounded-sm`}
                          />
                          <div className={`${editing === 'languages' ? 'flex' : 'hidden'} `}>
                            <RxCross2
                              onClick={() => deleteLangInput(0)}
                              className="text-baseBlack dark:text-lightBlue h-5 w-5 mx-2 hover:cursor-pointer hover:text-eyeCatchDark"
                            />
                            <BsPlusCircle
                              onClick={() => addLangInput(0)}
                              className="text-baseBlack dark:text-lightBlue h-5 w-5 mx-2 hover:cursor-pointer hover:text-eyeCatchDark"
                            />
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>

                <SaveCancelBtn
                  field='languages'
                  editing={editing}
                  isPending={isPending}
                  onCancelClick={onCancelClick}
                  handleEditStatus={handleEditStatus}
                />
              </div>
            </div>
          </div>
        </form>
      }
    </>
  );
}

export default DiverInfoPage;