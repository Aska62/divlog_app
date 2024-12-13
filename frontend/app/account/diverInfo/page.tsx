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
  const [editing, setEditing] = useState<string>('');

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

      <div className="w-2/3 max-w-sm h-fit mx-auto mt-6 mb-12">

        {/* Logged dive */}
        <div className="items-baseline my-14 md:flex">
          <p className="text-sm mr-2 md:w-36">Logged dive: </p>
          <p className="text-lg">{loggedDiveCount}</p>
        </div>

        {/* Unrecorded dive */}
        <div className="w-full mb-14 flex justify-between items-center">
          {editing === 'norecord_dive_count' ? (
            <form action="" className='w-full '>
              <div className='md:flex md:justify-between'>
                <label
                  htmlFor="norecord_dive_count"
                  className='text-sm mr-2'
                >Unrecorded dive:</label>
                <div className='flex flex-col'>
                  <div className='flex justify-stretch items-end w-full'>
                    <input
                      type="number"
                      name='norecord_dive_count'
                      id='norecord_dive_count'
                      value={diverInfo.norecord_dive_count}
                      className='w-full bg-lightBlue focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm'
                      />
                  </div>
                </div>
              </div>

              <div className='mt-1 text-right'>
                <button
                  onClick={() => setEditing('')} // TODO:
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                >Cancel</button>
                <button
                  onClick={() => setEditing('')} // TODO:
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </div>
            </form>
          ) : (
            <>
              <div className='items-baseline md:flex'>
                <p className="text-sm mr-2 md:w-36">Unrecorded dive: </p>
                <p className="text-lg">{diverInfo.norecord_dive_count}</p>
              </div>
              <button
                disabled={editing.length > 0}
                onClick={() => setEditing('norecord_dive_count')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            </>
          )}
        </div>

        {/* Total dive */}
        <div className="items-baseline mb-14 md:flex">
          <p className="text-sm mr-2 md:w-36">Total number of dive: </p>
          <p className="text-lg">{(diverInfo.norecord_dive_count || 0) + loggedDiveCount}</p>
        </div>

        {/* Height */}
        <div className="w-full mb-14 flex justify-between items-center">
          {editing === 'height' ? (
            <form action="" className='w-full '>
              <div className='md:flex md:justify-between'>
                <label
                  htmlFor="height"
                  className='text-sm mr-2'
                >Height:</label>
                <div className='flex flex-col'>
                  <div className='flex justify-stretch items-end w-full'>
                    <input
                      type="number"
                      name='height'
                      id='height'
                      value={diverInfo.height}
                      className='w-full bg-lightBlue focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm'
                      />
                      <span className='text-sm bg-lightBlue py-1 h-8 pr-2 rounded-tr-sm rounded-br-sm'>
                        {diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Inches' : 'cm'}
                      </span>
                  </div>
                </div>
              </div>

              <div className='mt-1 text-right'>
                <button
                  onClick={() => setEditing('')} // TODO:
                  className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                >Cancel</button>
                <button
                  onClick={() => setEditing('')} // TODO:
                  className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                >Save</button>
              </div>
            </form>
          ) : (
            <>
              <div className='items-baseline md:flex'>
                <p className="text-sm mr-2 md:w-36">Height: </p>
                <p className="text-lg">{diverInfo.height}
                  <span className='text-sm'>
                  {diverInfo.measurement_unit === UNIT_IMPERIAL ? ' Inches' : ' cm'}
                  </span>
                </p>
              </div>
              <button
                disabled={editing.length > 0}
                onClick={() => setEditing('height')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            </>
          )}
        </div>

        {/* Weight */}
        <div className="w-full mb-14 flex justify-between items-center">
          {editing === 'weight' ? (
            <form action="" className='w-full '>
              <label
                htmlFor="weight"
                className='text-sm mr-2'
              >Weight:</label>
              <div className='flex flex-col'>
                <div className='flex justify-stretch items-end w-full'>
                  <input
                    type="number"
                    name='weight'
                    id='weight'
                    value={diverInfo.weight}
                    className='w-full bg-lightBlue focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm'
                    />
                    <span className='text-sm bg-lightBlue py-1 h-8 pr-2 rounded-tr-sm rounded-br-sm'>
                      {diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Ib' : 'kg'}
                    </span>
                </div>
                <div className='mt-1 text-right'>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                  >Cancel</button>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                  >Save</button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className='items-baseline md:flex'>
                <p className="text-sm mr-2 md:w-36">Weight: </p>
                <p className="text-lg">{diverInfo.weight}
                  <span className='text-sm'>
                    {diverInfo.measurement_unit === UNIT_IMPERIAL ? ' Ib' : ' kg'}
                  </span>
                </p>
              </div>
              <button
                disabled={editing.length > 0}
                onClick={() => setEditing('weight')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            </>
          )}
        </div>

        {/* Shoe */}
        <div className="w-full mb-14 flex justify-between items-center">
          {editing === 'shoe' ? (
            <form action="" className='w-full '>
              <label
                htmlFor="shoe"
                className='text-sm mr-2'
              >Shoe size:</label>
              <div className='flex flex-col'>
                <div className='flex justify-stretch items-end w-full'>
                  <input
                    type="number"
                    name='shoe'
                    id='shoe'
                    value={diverInfo.shoe}
                    className='w-full bg-lightBlue focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm'
                    />
                    <span className='text-sm bg-lightBlue py-1 h-8 pr-2 rounded-tr-sm rounded-br-sm'>
                      {diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Inches' : 'cm'}
                    </span>
                </div>
                <div className='mt-1 text-right'>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                  >Cancel</button>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                  >Save</button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className='items-baseline md:flex'>
                <p className="text-sm mr-2 md:w-36">Shoe size: </p>
                <p className="text-lg">{diverInfo.shoe}
                  <span className='text-sm'>
                    {diverInfo.measurement_unit === UNIT_IMPERIAL ? ' Inches' : ' cm'}
                  </span>
                </p>
              </div>
              <button
                disabled={editing.length > 0}
                onClick={() => setEditing('shoe')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            </>
          )}
        </div>

        {/* Measurement unit */}
        <div className="w-full mb-14 flex justify-between items-center">
          {editing === 'measurement_unit' ? (
            <form action="" className='w-full '>
              <label
                htmlFor="measurement_unit"
                className='text-sm mr-2'
              >Measurement unit:</label>
              <div className='flex flex-col'>
                <div className='flex justify-stretch items-end w-full'>
                  <select
                    name="measurement_unit"
                    id="measurement_unit"
                    value={diverInfo.measurement_unit}
                    className='w-full bg-lightBlue focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm'
                  >
                    <option value="1">Metric</option>
                    <option value="2">Imperial</option>
                  </select>
                </div>
                <div className='mt-1 text-right'>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                  >Cancel</button>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                  >Save</button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className='items-baseline md:flex'>
                <p className="text-sm mr-2 md:w-36">Measurement unit: </p>
                <p className="text-lg">{diverInfo.measurement_unit === UNIT_IMPERIAL ? 'Imperial' : 'Metric'}</p>
              </div>
              <button
                disabled={editing.length > 0}
                onClick={() => setEditing('measurement_unit')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            </>
          )}
        </div>

        {/* Languages */}
        <div className="w-full mb-10 flex justify-between items-center md:items-start">
          {editing === 'languages' ? (
            <form action="" className='w-full '>
              <label
                htmlFor="languages"
                className='text-sm mr-2'
              >Languages:</label>
              <div className='flex flex-col'>
                <div className='flex justify-stretch items-end w-full'>
                  <input
                    type="text"
                    name='languages'
                    id='languages'
                    value={diverInfo.languages}
                    className='w-full bg-lightBlue focus:outline-none px-2 py-1 rounded-tl-sm rounded-bl-sm'
                    />
                </div>
                <div className='mt-1 text-right'>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-eyeCatch hover:bg-eyeCatchDark text-baseWhite px-2 mr-2 rounded-md'
                  >Cancel</button>
                  <button
                    onClick={() => setEditing('')} // TODO:
                    className='bg-darkBlue hover:bg-darkBlueLight text-baseWhite px-2 rounded-md'
                  >Save</button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className='items-baseline md:flex'>
                <p className="text-sm mr-2 md:w-36">Languages: </p>
                {diverInfo.languages && diverInfo.languages.length > 0 &&
                  <div>
                    {diverInfo.languages.map((lang) => (
                      <p className="text-lg" key={lang}>{lang}</p>
                    ))}
                  </div>
                }
              </div>
              <button
                disabled={editing.length > 0}
                onClick={() => setEditing('languages')}
                className={`${editing.length > 0 ? 'bg-lightGray' : 'bg-eyeCatchDark hover:bg-eyeCatch'} text-baseWhite px-2 rounded-md`}
              >Edit</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DiverInfoPage;