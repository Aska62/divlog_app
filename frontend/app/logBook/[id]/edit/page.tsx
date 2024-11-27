'use client';
import { useState, useEffect, MouseEvent } from 'react';
import axios from "axios";
import {
  DiveRecordDetail,
  isDiveRecordDetail,
  DiveRecordDetailKey,
} from '@/types/diveRecordTypes';
import { getNumDate } from "@/utils/dateTime/formatDate";
import formatTime from '@/utils/dateTime/formatTime';
import combineDateTime from '@/utils/dateTime/combineDateTime';
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

  const [buddyRef, setBuddyRef] = useState<Partial<ChoiceStateValue>>({
    id: diveRecord.buddy_ref,
    name: diveRecord.buddy?.divlog_name
  });
  const [supervisorRef, setSupervisorRef] = useState<Partial<ChoiceStateValue>>({
    id: diveRecord.supervisor_ref,
    name: diveRecord.supervisor?.divlog_name
  });
  const [diveCenterRef, setDiveCenterRef]= useState<Partial<ChoiceStateValue>>({
    id: diveRecord.dive_center_id,
    name: diveRecord.dive_center?.name
  });

  type ErrMsg = Record<
    Exclude<DiveRecordDetailKey,
      'id' | 'user_id' | 'created_at' | 'updated_at' | 'country' | 'purpose' | 'buddy' | 'supervisor' | 'dive_center'
    >, string
  >;

  const [errorMsg, setErrorMsg] = useState<ErrMsg>({
    log_no: '',
    date: '',
    location: '',
    country_id: '',
    purpose_id: '',
    course: '',
    weather: '',
    surface_temperature: '',
    water_temperature: '',
    max_depth: '',
    visibility: '',
    start_time: '',
    end_time: '',
    tankpressure_start: '',
    tankpressure_end: '',
    added_weight: '',
    suit: '',
    gears: '',
    buddy_str: '',
    buddy_ref: '',
    supervisor_str: '',
    supervisor_ref: '',
    dive_center_str: '',
    dive_center_id: '',
    notes: '',
    is_draft: ''
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
  const switchBuddyInput = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsBuddyById(!isBuddyById);
  }

  // Switch supervisor input methods
  const switchSupervisorInput = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSupervisorById(!isSupervisorById);
  }

  // Switch dive center input methods
  const switchDiveCenterInput = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDiveCenterById(!isDiveCenterById);
  }

  // Open search modal
  const openSearchModal = (
    e: MouseEvent<HTMLButtonElement>, modalType: ModalTypes
  ): void => {
    e.preventDefault();

    setModalType(modalType);
    setIsModalVisible(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const { id, value } = e.target;
    const newRecordVal: { [x:string]: string | number | Date } = {[id]: value};

    if (id === 'date') {
      if (diveRecord.start_time) {
        newRecordVal['start_time'] = combineDateTime(new Date(value), formatTime(diveRecord.start_time));
      }
      if (diveRecord.end_time) {
        newRecordVal['end_time'] = combineDateTime(new Date(value), formatTime(diveRecord.end_time));
      }
    }
    if (id === 'start_time') {
      const newStartTime = combineDateTime(diveRecord.date || new Date(), value);
      newRecordVal.start_time = newStartTime;
    }
    if (id === 'end_time') {
      const newEndTime = combineDateTime(diveRecord.date || new Date(), value)
      newRecordVal.end_time = newEndTime;
    }

    setDiveRecord({ ...diveRecord, ...newRecordVal });
  }

  const handleCheck = () => {
    const isDraft = { is_draft: !diveRecord.is_draft }
    setDiveRecord({ ...diveRecord, ...isDraft });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit func')
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
            <label htmlFor="log_no" className="md:w-24 text-wrap">
              Log No.<span className="text-eyeCatchDark">*</span>
            </label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="log_no"
                id="log_no"
                placeholder="Log no."
                defaultValue={ diveRecord.log_no }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
            <p className="text-eyeCatchDark text-end">{ errorMsg.log_no }</p>
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
                id="date"
                defaultValue={ diveRecord.date && getNumDate(diveRecord.date)}
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.date }</p>
            </div>
          </div>

          {/* Location */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="location" className="md:w-24 text-wrap">Location</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location"
                defaultValue={ diveRecord.location }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.location }</p>
            </div>
          </div>

          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="country_id" className="md:w-24 text-wrap">Country/ Region</label>
            <div className="w-full md:w-8/12">
              <select
                name="country_id"
                id="country_id"
                onChange={(e) => handleInputChange(e)}
                className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
              >
                <option value="" > --- Please select --- </option>
                <CountryOptions selected={ diveRecord.country_id } />
              </select>
              <p className="text-eyeCatchDark text-end">{ errorMsg.country_id }</p>
            </div>
          </div>

          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="purpose_id" className="md:w-24 text-wrap">Purpose</label>
            <div className="w-full md:w-8/12">
              <select
                name="purpose_id"
                id="purpose_id"
                onChange={(e) => handleInputChange(e)}
                className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
              >
                <option value="" > --- Please select --- </option>
                <DivePurposeOptions selected={ diveRecord.purpose_id } />
              </select>
              <p className="text-eyeCatchDark text-end">{ errorMsg.purpose_id }</p>
            </div>
          </div>

          {/* Course */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="course" className="md:w-24 text-wrap">Course</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="course"
                id="course"
                placeholder="Course"
                defaultValue={ diveRecord.course }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.course }</p>
            </div>
          </div>

          {/* Weather */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="weather" className="md:w-24 text-wrap">Weather</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="weather"
                id="weather"
                placeholder="Weather"
                defaultValue={ diveRecord.weather }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.weather }</p>
            </div>
          </div>

          {/* Surface Temperature */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="surface_temperature" className="md:w-24 text-wrap">Surface temperature</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="surface_temperature"
                id="surface_temperature"
                placeholder="Surface temperature"
                defaultValue={ diveRecord.surface_temperature }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.surface_temperature }</p>
            </div>
          </div>

          {/* Water Temperature */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="water_temperature" className="md:w-24 text-wrap">Water temperature</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="water_temperature"
                id="water_temperature"
                placeholder="Water temperature"
                defaultValue={ diveRecord.water_temperature }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.water_temperature }</p>
            </div>
          </div>

          {/* Start time */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-startr md:justify-between md:items-start">
            <label htmlFor="start_time" className="md:w-24 text-wrap">Start time<span className="text-eyeCatchDark">*</span></label>
            <div className="w-full md:w-8/12">
              <input
                type="time"
                name="start_time"
                id="start_time"
                defaultValue={ diveRecord.start_time && formatTime(diveRecord.start_time) }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.start_time }</p>
            </div>
          </div>

          {/* End time */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="end_time" className="md:w-24 text-wrap">End time</label>
            <div className="w-full md:w-8/12">
              <input
                type="time"
                name="end_time"
                id="end_time"
                defaultValue={ diveRecord.end_time && formatTime(diveRecord.end_time) }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.end_time }</p>
            </div>
          </div>

          {/* Tank pressure start */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="tankpressure_start" className="md:w-24 text-wrap">Tank pressure start</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="tankpressure_start"
                id="tankpressure_start"
                placeholder="Tank pressure start"
                defaultValue={ diveRecord.tankpressure_start }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.tankpressure_start }</p>
            </div>
          </div>

          {/* Tank pressure end */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="tankpressure_end" className="md:w-24 text-wrap">Tank pressure end</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="tankpressure_end"
                id="tankpressure_end"
                placeholder="Tank pressure end"
                defaultValue={ diveRecord.tankpressure_end }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.tankpressure_end }</p>
            </div>
          </div>

          {/* Weight */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="weight" className="md:w-24 text-wrap">Weight added</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="weight"
                id="weight"
                placeholder="Weight added"
                defaultValue={ diveRecord.added_weight }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.added_weight }</p>
            </div>
          </div>

          {/* Suit */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="suit" className="md:w-24 text-wrap">Suit</label>
            <div className="w-full md:w-8/12">
              <input
                type="text"
                name="suit"
                id="suit"
                placeholder="Suit"
                defaultValue={ diveRecord.suit }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.suit }</p>
            </div>
          </div>

          {/* Max depth */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="max_depth" className="md:w-24 text-wrap">Max depth</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="max_depth"
                id="max_depth"
                placeholder="Max depth"
                defaultValue={ diveRecord.max_depth }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.max_depth }</p>
            </div>
          </div>

          {/* Visibility */}
          <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="visibility" className="md:w-24 text-wrap">Visibility</label>
            <div className="w-full md:w-8/12">
              <input
                type="number"
                name="visibility"
                id="visibility"
                placeholder="Visibility"
                defaultValue={ diveRecord.visibility }
                onChange={(e) => handleInputChange(e)}
                className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
              />
              <p className="text-eyeCatchDark text-end">{ errorMsg.visibility }</p>
            </div>
          </div>

          {/* Buddy */}
          <div className="w-10/12 md:w-full h-32 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between">
            <div className='w-full md:w-4/12 md:h-2/3 flex flex-col justify-between md:items-start mb-2'>
              <label htmlFor={`${isBuddyById ? 'buddy_ref' : 'buddy_str'}`} className="md:w-24 text-wrap mb-1">Buddy</label>
              <div className='flex md:flex-col'>
                <button
                  onClick={(e) => switchBuddyInput(e)}
                  disabled={isBuddyById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 mr-3 md:mb-2 ${ isBuddyById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >{ isBuddyById ? 'Click to search' : 'Choose on DivLog'}</button>
                <button
                  onClick={(e) => switchBuddyInput(e)}
                  disabled={!isBuddyById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 ${ !isBuddyById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Input</button>
              </div>
            </div>
            <div className="w-full md:w-8/12">
              { isBuddyById ? (
                <div
                  className='flex flex-row-reverse items-end justify-between'
                >
                  <button
                    onClick={(e) => openSearchModal(e, modalTypeBuddy)}
                    disabled={!isBuddyById}
                    className='rounded-md md:w-fit px-2 ml-3 md:mb-2 bg-red-400 text-baseWhite text-lg font-semibold'
                  >Search</button>
                  <p>{ buddyRef.name }</p>
                  <input
                    type="hidden"
                    name="buddy_ref"
                    id="buddy_ref"
                    value={ buddyRef.id }
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    name="buddy_str"
                    id="buddy_str"
                    placeholder="Buddy"
                    defaultValue={ diveRecord.buddy_str }
                    onChange={(e) => handleInputChange(e)}
                    className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                  />
                </>
              )}
              <p className="text-eyeCatchDark text-end">{ !isBuddyById && errorMsg.buddy_str }</p>
            </div>
          </div>

          {/* Supervisor */}
          <div className="w-10/12 md:w-full h-32 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between">
            <div className='w-full md:w-4/12 md:h-2/3 flex flex-col justify-between md:items-start mb-2'>
            <label htmlFor={`${isSupervisorById ? 'supervisor_ref' : 'supervisor_str'}`} className="md:w-24 text-wrap mb-1">Supervisor</label>
              <div className='flex md:flex-col'>
                <button
                  onClick={(e) => switchSupervisorInput(e)}
                  disabled={isSupervisorById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 mr-3 md:mb-2 ${ isSupervisorById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Choose on DivLog</button>
                <button
                  onClick={(e) => switchSupervisorInput(e)}
                  disabled={!isSupervisorById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 ${ !isSupervisorById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Input</button>
              </div>
            </div>

            <div className="w-full md:w-8/12">
              { isSupervisorById ? (
                <div
                  className='flex flex-row-reverse items-end justify-between'
                >
                  <button
                    onClick={(e) => openSearchModal(e, modalTypeSupervisor)}
                    disabled={!isSupervisorById}
                    className='rounded-md md:w-fit px-2 ml-3 md:mb-2 bg-red-400 text-baseWhite text-lg font-semibold'
                  >Search</button>
                  <p>{ supervisorRef.name }</p>
                  <input
                    type="hidden"
                    name="supervisor_ref"
                    id="supervisor_ref"
                    value={ supervisorRef.id }
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    name="supervisor_str"
                    id="supervisor_str"
                    placeholder="Supervisor"
                    defaultValue={ diveRecord.supervisor_str }
                    onChange={(e) => handleInputChange(e)}
                    className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                  />
                </>
              )}
              <p className="text-eyeCatchDark text-end">{ !isSupervisorById && errorMsg.supervisor_str }</p>
            </div>
          </div>

          {/* Dive Center */}
          <div className="w-10/12 md:w-full h-32 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between">
            <div className='w-full md:w-4/12 md:h-2/3 flex flex-col justify-between md:items-start mb-2'>
              <label htmlFor={`${ isDiveCenterById ? 'dive_center_id' : 'dive_center_str' }`} className="md:w-24 text-wrap mb-1">Dive Center</label>
              <div className='flex md:flex-col'>
                <button
                  onClick={(e) => switchDiveCenterInput(e)}
                  disabled={isDiveCenterById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 mr-3 md:mb-2 ${ isDiveCenterById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >{ isDiveCenterById ? 'Click to search' : 'Choose on DivLog'}</button>
                <button
                  onClick={(e) => switchDiveCenterInput(e)}
                  disabled={!isDiveCenterById}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 ${ !isDiveCenterById && 'bg-lightGray dark:bg-lightGray dark:text-baseWhite hover:cursor-default' }`}
                >Input</button>
              </div>
            </div>

            <div className="w-full md:w-8/12">
              { isDiveCenterById ? (
                <div
                  className='flex flex-row-reverse items-end justify-between'
                >
                  <button
                    onClick={(e) => openSearchModal(e, modalTypeDiveCenter)}
                    disabled={!isDiveCenterById}
                    className='rounded-md md:w-fit px-2 ml-3 md:mb-2 bg-red-400 text-baseWhite text-lg font-semibold'
                  >Search</button>
                  <p>{ diveCenterRef.name }</p>
                  <input
                    type="hidden"
                    name="dive_center_id"
                    id="dive_center_id"
                    value={ diveCenterRef.id }
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    name="dive_center_str"
                    id="dive_center_str"
                    placeholder="DiveCenter"
                    defaultValue={ diveRecord.dive_center_str }
                    onClick={(e) => handleInputChange(e)}
                    className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                  />
                </>
              )}
              <p className="text-eyeCatchDark text-end">{ !isDiveCenterById && errorMsg.dive_center_str }</p>
            </div>
          </div>

          {/* Note */}
          <div className="w-10/12 md:w-full my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
            <label htmlFor="note" className="md:w-24 text-wrap">Note</label>
            <div className="w-full md:w-8/12">
              <textarea
                name="notes"
                id="notes"
                placeholder="Note"
                defaultValue={ diveRecord.notes }
                onChange={(e) => handleInputChange(e)}
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
                name="is_draft"
                id="is_draft"
                checked={ diveRecord.is_draft }
                onChange={handleCheck}
              />
              <label htmlFor="is_draft" className="w-24 text-wrap ml-2">Save as draft</label>
            </div>
            <p className="text-eyeCatchDark text-end">{ errorMsg.is_draft }</p>
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
                modalType === modalTypeBuddy ? setBuddyRef
                : modalType === modalTypeSupervisor ? setSupervisorRef
                : modalType === modalTypeDiveCenter && setDiveCenterRef
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