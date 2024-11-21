'use client';
import { useState, useEffect, MouseEvent } from 'react';
import axios from "axios";
import { DiveRecordDetail, isDiveRecordDetail } from '@/types/diveRecordTypes';
import { getNumDate } from "@/utils/dateTime/formatDate";
import formatTime from '@/utils/dateTime/formatTime';
import Heading from "@/components/Heading";
import UpdateLogBtn from "@/components/log/UpdateLogBtn";
import CountryOptions from '@/components/CountryOptions';
import DivePurposeOptions from '@/components/log/DivePurposeOptions';
import SearchModal from '@/components/log/SearchModal';

type EditLogProps = {
  params: Promise<{ id: string }>
}

export type ModalTypes = 1 | 2 | 3;
export const modalTypeBuddy = 1;
export const modalTypeSupervisor = 2;
export const modalTypeDiveCenter = 3;

export type ChoiceStateValue = { id: string, name: string };

const EditLog:React.FC<EditLogProps> = ({ params }) => {
  const [diveRecord, setDiveRecord] = useState<Partial<DiveRecordDetail>>({});
  const [isBuddyById, setIsBuddyById] = useState<boolean>(true);
  const [isSupervisorById, setIsSupervisorById] = useState<boolean>(true);
  const [isDiveCenterById, setIsDiveCenterById] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | 0>(1);
  const [buddyChoice, setBuddyChoice] = useState<ChoiceStateValue | {}>({
    id: diveRecord.buddy_ref,
    name: diveRecord.buddy?.divlog_name
  });
  const [supervisorChoice, setSupervisorChoice] = useState<ChoiceStateValue | {}>({
    id: diveRecord.supervisor_ref,
    name: diveRecord.supervisor?.divlog_name
  });
  const [diveCenterChoice, setDiveCenterChoice]= useState<ChoiceStateValue | {}>({
    id: diveRecord.dive_center_id,
    name: diveRecord.dive_center?.name
  });

  useEffect(() => {
    const fetchLogRecord = async () => {
      const { id } = await params;
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/diveRecords/${id}`,
        { withCredentials: true })
        .then((res) => {
          setDiveRecord(res.data);
          setIsBuddyById(!res.data.buddy_str);
          setIsSupervisorById(!res.data.supervisor_str);
          setIsDiveCenterById(!res.data.dive_center_str);
        })
        .catch((err) => {
          console.log('Error fetching dive records: ', err);
          setDiveRecord({});
        });
    }

    fetchLogRecord();
  }, [params]);

  // Switch buddy input methods
  const onBuddyChooseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setModalType(modalTypeBuddy);
    if (isBuddyById) {
      setIsModalVisible(!isModalVisible);
    } else {
      setIsBuddyById(true);
    }
  }

  const onBuddyInputClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsModalVisible(false);
    setIsBuddyById(false);
    setModalType(0);
  }

  // Switch supervisor input methods
  const onSupervisorChooseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setModalType(modalTypeSupervisor);
    if (isSupervisorById) {
      setIsModalVisible(!isModalVisible);
    } else {
      setIsSupervisorById(true);
    }
  }

  const onSupervisorInputClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsModalVisible(false);
    setIsSupervisorById(false);
    setModalType(0);
  }

  // Switch dive center input methods
  const onDiveCenterChooseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setModalType(modalTypeDiveCenter);
    if (isDiveCenterById) {
      setIsModalVisible(!isModalVisible);
    } else {
      setIsDiveCenterById(true);
    }
  }

  const onDiveCenterInputClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsModalVisible(false);
    setIsDiveCenterById(false);
    setModalType(0);
  }

  return (
    <>
      { diveRecord && isDiveRecordDetail(diveRecord) ? (
      <>
        <Heading pageTitle={`Edit Log No. ${diveRecord.log_no}`} />

        <form action="#" className="w-11/12 max-w-xl h-fit mx-auto my-12">
          <p className="w-10/12 md:w-full text-center md:text-left mb-8 text-eyeCatchDark">* mandatory</p>

          {/* Log number */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="logNo" className="md:w-24 text-wrap">
              Log No.<span className="text-eyeCatchDark">*</span>
            </label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="logNo"
                placeholder="Log no."
                defaultValue={ diveRecord.log_no }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
            <p className="text-eyeCatchDark text-end">error arimasu</p>
            </div>
          </div>

          {/* Date */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="date" className="md:w-24 text-wrap">
              Date<span className="text-eyeCatchDark">*</span>
            </label>
            <div className="w-full md:w-8/12">
              <input
                type="date"
                name="date"
                defaultValue={ diveRecord.date && getNumDate(diveRecord.date)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">error arimasu</p>
            </div>
          </div>

          {/* Location */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="location" className="md:w-24 text-wrap">Location</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="location"
                placeholder="Location"
                defaultValue={ diveRecord.location }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Country TODO: default select */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="logNo" className="md:w-24 text-wrap">Country/ Region</label>
            <div className="w-full md:w-8/12">
              <select
                name="purpose"
                id="country_region"
                defaultValue={ diveRecord.country_id }
                className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
              >
                <option value="" > --- Please select --- </option>
                <CountryOptions />
              </select>
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Purpose TODO: default select */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="logNo" className="md:w-24 text-wrap">Purpose</label>
            <div className="w-full md:w-8/12">
              <select
                name="purpose"
                id="purpose"
                defaultValue={ diveRecord.purpose_id }
                className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
              >
                <option value="" > --- Please select --- </option>
                <DivePurposeOptions />
              </select>
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Course */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="course" className="md:w-24 text-wrap">Course</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="course"
                placeholder="Course"
                defaultValue={ diveRecord.course }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Weather */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="weather" className="md:w-24 text-wrap">Weather</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="weather"
                placeholder="Weather"
                defaultValue={ diveRecord.weather }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Surface Temperature */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="surfaceTemperature" className="md:w-24 text-wrap">Surface temperature</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="surfaceTemperature"
                placeholder="Surface temperature"
                defaultValue={ diveRecord.surface_temperature }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">error arimasu</p>
            </div>
          </div>

          {/* Water Temperature */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="waterTemperature" className="md:w-24 text-wrap">Water temperature</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="waterTemperature"
                placeholder="Water temperature"
                defaultValue={ diveRecord.water_temperature }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">error arimasu</p>
            </div>
          </div>

          {/* Start time */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-startr md:justify-between md:items-start">
            <label htmlFor="startTime" className="md:w-24 text-wrap">Start time<span className="text-eyeCatchDark">*</span></label>
            <div className="w-full md:w-8/12">
              <input
                type="time"
                name="startTime"
                defaultValue={ diveRecord.start_time && formatTime(diveRecord.start_time) }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* End time */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="endTime" className="md:w-24 text-wrap">End time</label>
            <div className="w-full md:w-8/12">
              <input
                type="time"
                name="endTime"
                defaultValue={ diveRecord.end_time && formatTime(diveRecord.end_time) }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Tank pressure start */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="tankPresureStart" className="md:w-24 text-wrap">Tank pressure start</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="tankPresureStart"
                placeholder="Tank pressure start"
                defaultValue={ diveRecord.tankpressure_start }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Tank pressure end */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="tankPresureEnd" className="md:w-24 text-wrap">Tank pressure end</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="tankPresureEnd"
                placeholder="Tank pressure end"
                defaultValue={ diveRecord.tankpressure_end }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end"></p>
            </div>
          </div>

          {/* Weight */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="weight" className="md:w-24 text-wrap">Weight added</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="weight"
                placeholder="Weight added"
                defaultValue={ diveRecord.added_weight }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Suit */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="suit" className="md:w-24 text-wrap">Suit</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="suit"
                placeholder="Suit"
                defaultValue={ diveRecord.suit }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Max depth */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="maxDepth" className="md:w-24 text-wrap">Max depth</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="maxDepth"
                placeholder="Max depth"
                defaultValue={ diveRecord.max_depth }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Visibility */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="visibility" className="md:w-24 text-wrap">Visibility</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="visibility"
                placeholder="Visibility"
                defaultValue={ diveRecord.visibility }
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Buddy */}
          <div className="w-10/12 md:w-full h-32 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between">
            <div className='w-full md:w-4/12 md:h-2/3 flex flex-col justify-between md:items-start mb-2'>
              <label htmlFor="diveCenter" className="md:w-24 text-wrap mb-1">Buddy</label>
              <div className='flex md:flex-col'>
                <button
                  onClick={(e) => onBuddyChooseClick(e)}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 mr-3 md:mb-2 ${ isBuddyById && 'bg-darkBlueLight hover:opacity-75 hover:cursor-pointer transition duration-75' }`}
                >{ isBuddyById ? 'Click to search' : 'Choose on DivLog'}</button>
                <button
                  onClick={(e) => onBuddyInputClick(e)}
                  disabled={!isBuddyById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 ${ !isBuddyById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Input</button>
              </div>
            </div>
            <div className="w-full md:w-8/12">
              { isBuddyById ? (
                <p>{ diveRecord.buddy?.divlog_name }</p> // TODO:display buddyChoice
              ) : (
                <>
                  <input
                    type="text"
                    name="buddy"
                    placeholder="Buddy"
                    defaultValue={ diveRecord.buddy_str }
                    className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                  />
                </>
              )}
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Supervisor */}
          <div className="w-10/12 md:w-full h-32 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between">
            <div className='w-full md:w-4/12 md:h-2/3 flex flex-col justify-between md:items-start mb-2'>
            <label htmlFor="diveCenter" className="md:w-24 text-wrap mb-1">Supervisor</label>
              <div className='flex md:flex-col'>
                <button
                  onClick={(e) => onSupervisorChooseClick(e)}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 mr-3 md:mb-2 ${ isSupervisorById && 'bg-darkBlueLight hover:opacity-75 hover:cursor-pointer transition duration-75' }`}
                >{ isSupervisorById ? 'Click to search' : 'Choose on DivLog'}</button>
                <button
                  onClick={(e) => onSupervisorInputClick(e)}
                  disabled={!isSupervisorById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 ${ !isSupervisorById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Input</button>
              </div>
            </div>

            <div className="w-full md:w-8/12">
              { isSupervisorById ? (
                <p>{ diveRecord.supervisor?.divlog_name }</p>
              ) : (
                <>
                {/* TODO:display supervisorChoice */}
                  <input
                    type="text"
                    name="supervisor"
                    placeholder="Supervisor"
                    defaultValue={ diveRecord.supervisor_str }
                    className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                  />
                </>
              )}
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Dive Center */}
          <div className="w-10/12 md:w-full h-32 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between">
            <div className='w-full md:w-4/12 md:h-2/3 flex flex-col justify-between md:items-start mb-2'>
              <label htmlFor="diveCenter" className="md:w-24 text-wrap mb-1">Dive Center</label>
              <div className='flex md:flex-col'>
                <button
                  onClick={(e) => onDiveCenterChooseClick(e)}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 mr-3 md:mb-2 ${ isDiveCenterById && 'bg-darkBlueLight hover:opacity-75 hover:cursor-pointer transition duration-75' }`}
                >{ isDiveCenterById ? 'Click to search' : 'Choose on DivLog'}</button>
                <button
                  onClick={(e) => onDiveCenterInputClick(e)}
                  disabled={!isDiveCenterById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 ${ !isDiveCenterById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Input</button>
              </div>
            </div>

            <div className="w-full md:w-8/12">
              { isDiveCenterById ? (
                <p>{ diveRecord.dive_center?.name }</p>
              ) : (
                <>
                  {/* TODO:display diveCenterChoice */}
                  <input
                    type="text"
                    name="diveCenter"
                    placeholder="DiveCenter"
                    defaultValue={ diveRecord.dive_center_str }
                    className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                  />
                </>
              )}
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Note */}
          <div className="w-10/12 md:w-full my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="note" className="md:w-24 text-wrap">Note</label>
            <div className="w-full md:w-8/12">
              <textarea
                name="note"
                id="note"
                placeholder="Dive Center"
                defaultValue={ diveRecord.notes }
                className="w-full h-60 bg-lightBlue dark:bg-baseWhite px-2 mt-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{}</p>
            </div>
          </div>

          {/* Is draft */}
          <div className="ww-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-center md:justify-between md:items-start">
            <div className="w-full md:w-8/12">
              <input
                type="checkbox"
                name="isDraft"
                defaultChecked={ diveRecord.is_draft }
              />
              <label htmlFor="isDraft" className="w-24 text-wrap ml-2">Save as draft</label>
            </div>
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>

          <div className="w-full text-center mb-28">
            <UpdateLogBtn />
          </div>
        </form>

        { isModalVisible && (
          <div className='w-screen h-screen fixed z-20 top-0 left-0 bg-baseWhite70'>
            <SearchModal
              type={ modalType }
              setData={
                modalType === modalTypeBuddy ? setBuddyChoice
                : modalType === modalTypeSupervisor ? setSupervisorChoice
                : modalType === modalTypeDiveCenter && setDiveCenterChoice
              }
              setIsModalVisible={() => setIsModalVisible(false)}
            />
          </div>
        )}
      </>
      ) : (
      <>
        Loading...
      </>
      )}
    </>
  );
}

export default EditLog;