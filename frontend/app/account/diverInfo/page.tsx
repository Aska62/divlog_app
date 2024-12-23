'use client';
import React, { useState, useEffect, useActionState } from 'react';
// import { revalidatePath } from 'next/cache';
import { toast } from 'react-toastify';
import { RxCross2 } from "react-icons/rx";
import { BsPlusCircle } from "react-icons/bs";
import { UNIT_IMPERIAL } from '@/constants/unit';
import { DiverInfoType } from '@/types/diverInfoTypes';
import { getDiverInfo } from '@/actions/diverInfo/getDiverInfo';
import updateDiverInfo from '@/actions/diverInfo/updateDiverInfo';
import { getRecordCount } from '@/actions/diveRecord/getRecordCount';
import Heading from "@/components/Heading";
import isNumString from '@/utils/isNumString';

const DiverInfoPage = () => {
  const [diverInfo, setDiverInfo] = useState<Partial<DiverInfoType>>({});
  const [diverInfoInDb, setDiverInfoInDb] = useState<Partial<DiverInfoType>>({});
  const [langInputs, setLangInputs] = useState<string[]>([]);
  const [loggedDiveCount, setLoggedDiveCount] = useState<number>(0);
  const [editing, setEditing] = useState<string>('');

  const [state, formAction, isPending] = useActionState(updateDiverInfo, {});

  useEffect(() => {
    const fetchDiverInfo = async() => {
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

    fetchDiverInfo();
  }, []);

  const handleEditStatus = (e:React.MouseEvent, type?:string) => {
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

      <form action={formAction} className="w-2/3 max-w-sm h-fit mx-auto mt-6 mb-12">
        {diverInfo.id && <input type="hidden" name='id' value={diverInfo.id} />}

        {/* Logged dive */}
        <div className="items-baseline my-14 md:flex">
          <p className="text-sm mr-4 md:w-36">Logged dive: </p>
          <p className="text-lg">{loggedDiveCount}</p>
        </div>

        {/* Unrecorded dive */}
        <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
          <div className='md:flex md:justify-between'>
            <label
              htmlFor="norecord_dive_count"
              className='text-sm mr-2 md:mt-2 md:w-36'
            >Unrecorded dive:</label>
            <div className='flex flex-col'>
              <div className='flex justify-stretch items-end w-full'>
                <input
                  type="number"
                  name='norecord_dive_count'
                  id='norecord_dive_count'
                  value={diverInfo.norecord_dive_count || ''}
                  onChange={(e) => { if (editing === 'norecord_dive_count') handleInputChange(e)}}
                  disabled={editing !== 'norecord_dive_count' || isPending}
                  className={`${editing === 'norecord_dive_count' ? 'bg-lightBlue dark:text-baseBlack ' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite'} md:w-36 focus:outline-none px-2 py-1 rounded-sm text-lg`}
                />
              </div>
            </div>
          </div>

          <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
            { editing === 'norecord_dive_count' ? (
              <>
                <button
                  onClick={(e) => onCancelClick(e)}
                  disabled={isPending}
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 md:mr-0 md:mb-2 rounded-md'
                >Cancel</button>
                <button
                  disabled={isPending}
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </>
            ) : (
              <button
                disabled={editing.length > 0 || isPending}
                onClick={(e) => handleEditStatus(e, 'norecord_dive_count')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            )}
          </div>
        </div>

        {/* Total dive */}
        <div className="items-baseline mb-14 md:flex">
          <p className="text-sm mr-4 md:w-36">Total number of dive: </p>
          <p className="text-lg">{(diverInfo.norecord_dive_count || 0) + loggedDiveCount}</p>
        </div>

        {/* Height */}
        <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
          <div className='md:flex md:justify-between'>
            <label
              htmlFor="height"
              className='text-sm mr-2 md:mt-2 md:w-36'
            >Height:</label>
            <div className='flex flex-col'>
              <div className='flex justify-stretch items-end w-full'>
                <input
                  type="number"
                  name='height'
                  id='height'
                  value={diverInfo.height || ''}
                  onChange={(e) =>{if (editing === 'height') handleInputChange(e)}}
                  disabled={editing !== 'height' || isPending}
                  className={`${editing === 'height' ? 'bg-lightBlue dark:text-baseBlack md:w-36' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-20'} focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm text-lg`}
                />
                <span className={`${editing === 'height' ? 'bg-lightBlue dark:text-baseBlack' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite'} text-sm h-9 py-2 pr-2 rounded-tr-sm rounded-br-sm`}>
                  {diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Inches' : 'cm'}
                </span>
              </div>
            </div>
          </div>

          <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
            { editing === 'height' ? (
              <>
                <button
                  onClick={(e) => onCancelClick(e)}
                  disabled={isPending}
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 md:mr-0 md:mb-2 rounded-md'
                >Cancel</button>
                <button
                  disabled={isPending}
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </>
            ) : (
              <button
                disabled={editing.length > 0 || isPending}
                onClick={(e) => handleEditStatus(e, 'height')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            )}
          </div>
        </div>

        {/* Weight */}
        <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
          <div className='md:flex md:justify-between'>
            <label
              htmlFor="weight"
              className='text-sm mr-2 md:mt-2 md:w-36'
            >Weight:</label>
            <div className='flex flex-col'>
              <div className='flex justify-stretch items-end w-full'>
                <input
                  type="number"
                  name='weight'
                  id='weight'
                  value={diverInfo.weight || ''}
                  onChange={(e) => {if (editing === 'weight') handleInputChange(e)}}
                  disabled={editing !== 'weight' || isPending}
                  className={`${editing === 'weight' ? 'bg-lightBlue dark:text-baseBlack md:w-36' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-20'} focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm text-lg`}
                />
                <span className={`${editing === 'weight' ? 'bg-lightBlue dark:text-baseBlack' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite'} text-sm h-9 py-2 pr-2 rounded-tr-sm rounded-br-sm`}>
                  {diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Ib' : 'kg'}
                </span>
              </div>
              </div>
          </div>

          <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
            { editing === 'weight' ? (
              <>
                <button
                  onClick={(e) => onCancelClick(e)}
                  disabled={isPending}
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 md:mr-0 md:mb-2 rounded-md'
                >Cancel</button>
                <button
                  disabled={isPending}
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </>
            ) : (
              <button
                disabled={editing.length > 0 || isPending}
                onClick={(e) => handleEditStatus(e, 'weight')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            )}
          </div>
        </div>

        {/* Shoe */}
        <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
          <div className='md:flex md:justify-between'>
            <label
              htmlFor="shoe"
              className='text-sm mr-2 md:mt-2 md:w-36'
            >Shoe size:</label>
            <div className='flex flex-col'>
              <div className='flex justify-stretch items-end w-full'>
                <input
                  type="number"
                  name='shoe'
                  id='shoe'
                  value={diverInfo.shoe || ''}
                  onChange={(e) => {if (editing === 'shoe') handleInputChange(e)}}
                  disabled={editing !== 'shoe' || isPending}
                  className={`${editing === 'shoe' ? 'bg-lightBlue dark:text-baseBlack md:w-36' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-20'} dark:text-baseBlack focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm text-lg`}
                />
                <span className={`${editing === 'shoe' ? 'bg-lightBlue dark:text-baseBlack' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite'} text-sm h-9 py-2 pr-2 rounded-tr-sm rounded-br-sm`}>
                  {diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Inches' : 'cm'}
                </span>
              </div>
            </div>
          </div>

          <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
            { editing === 'shoe' ? (
              <>
                <button
                  onClick={(e) => onCancelClick(e)}
                  disabled={isPending}
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                >Cancel</button>
                <button
                  disabled={isPending}
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </>
            ) : (
              <button
                disabled={editing.length > 0 || isPending}
                onClick={(e) => handleEditStatus(e, 'shoe')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            )}
          </div>
        </div>

        {/* Measurement unit */}
        <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
          <div className='md:flex md:justify-between'>
            <label
              htmlFor="measurement_unit"
              className='text-sm mr-2 md:mt-2 md:w-36'
            >Measurement unit:</label>
            <div className='flex flex-col'>
              <div className='flex justify-stretch items-end w-full'>
                <select
                  name="measurement_unit"
                  id="measurement_unit"
                  value={diverInfo.measurement_unit || ''}
                  onChange={(e) => {if (editing !== 'measurement_unit') handleInputChange(e)}}
                  disabled={editing !== 'measurement_unit'}
                  className={`${editing === 'measurement_unit' ? 'bg-lightBlue dark:text-baseBlack appearance-auto' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite appearance-none'} md:w-36 focus:outline-none px-2 py-1 rounded-sm text-lg`}
                >
                  <option value="1">Metric</option>
                  <option value="2">Imperial</option>
                </select>
              </div>
            </div>
          </div>

          <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
            { editing === 'measurement_unit' ? (
              <>
                <button
                  onClick={(e) => onCancelClick(e)}
                  disabled={isPending}
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 md:mr-0 md:mb-2 rounded-md'
                >Cancel</button>
                <button
                  disabled={isPending}
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </>
            ) : (
              <button
                disabled={editing.length > 0 || isPending}
                onClick={(e) => handleEditStatus(e, 'measurement_unit')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="w-full mb-14 flex flex-col md:flex-row justify-between items-start">
          <div className='md:flex md:justify-between'>
            <label
              htmlFor="languages"
              className='text-sm mr-2 md:mt-2 md:w-36'
            >Languages:</label>
            <div className='flex flex-col md:flex-row'>

              <div className='flex justify-stretch items-end w-full'>
                <div className='w-full'>
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
                          className={`${editing === 'languages' ? 'bg-lightBlue dark:text-baseBlack w-full' : 'bg-baseWhite dark:bg-baseBlack dark:text-baseWhite w-48'} dark:text-baseBlack focus:outline-none px-2 py-1 mb-1 rounded-sm`}
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

              <div className='mt-1 md:mt-0 md:ml-2 text-right flex md:flex-col'>
                { editing === 'languages' ? (
                  <>
                    <button
                      onClick={(e) => onCancelClick(e)}
                      disabled={isPending}
                      className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 md:mr-0 md:mb-2 rounded-md'
                    >Cancel</button>
                    <button
                      disabled={isPending}
                      className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                    >Save</button>
                  </>
                ) : (
                  <button
                    disabled={editing.length > 0 || isPending}
                    onClick={(e) => handleEditStatus(e, 'languages')}
                    className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
                  >Edit</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default DiverInfoPage;