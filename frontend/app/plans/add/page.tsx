'use client';
import { useState, useEffect, MouseEvent, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useScroll from '@/stores/useScroll';
import { DivePlanDetail } from "@/types/divePlanTypes";
import { getNumDate } from "@/utils/dateTime/formatDate";
import formatTime from '@/utils/dateTime/formatTime';
import combineDateTime from '@/utils/dateTime/combineDateTime';
import isNumber from '@/utils/isNumber';
import isObjectValEmpty from '@/utils/isObjectValEmpty';
import { isKeyWithNumVal } from '@/types/diveRecordTypes';
import addDivePlan from '@/actions/divePlan/addDivePlan';
import Heading from "@/components/Heading";
import CountryOptions, { CountryOptionList } from '@/components/CountryOptions';
import DivePurposeOptions, { DivePurposeOptionList } from '@/components/log/DivePurposeOptions';
import SearchModal from '@/components/log/SearchModal';
import SaveNewLogBtn from "@/components/log/SaveNewLogBtn";
import {
  diveRecordModalTypes,
  ModalTypes,
  ChoiceStateValue
} from '../../logBook/[id]/edit/page';
import { PlanErrMsg } from '../[id]/edit/page';

const AddDivePlanPage:React.FC = () => {
  const router = useRouter();

  const setIsScrollable = useScroll((state) => state.setIsScrollable);
  const isScrollable = useScroll.getState().isScrollable;

  const [state, formAction, isPending] = useActionState(addDivePlan, {});

  const [divePlan, setDivePlan] = useState<Partial<DivePlanDetail>>({});
  const [countryList, setCountryList] = useState<CountryOptionList>([]);
  const [purposeList, setPurposeList] = useState<DivePurposeOptionList>([]);

  const [isBuddyById, setIsBuddyById] = useState<boolean>(true);
  const [isSupervisorById, setIsSupervisorById] = useState<boolean>(true);
  const [isDiveCenterById, setIsDiveCenterById] = useState<boolean>(true);

  const [buddyRef, setBuddyRef] = useState<Partial<ChoiceStateValue>>({
    id: divePlan.buddy?.id,
    name: divePlan.buddy?.divlog_name
  });
  const [supervisorRef, setSupervisorRef] = useState<Partial<ChoiceStateValue>>({
    id: divePlan.supervisor?.id,
    name: divePlan.supervisor?.divlog_name
  });
  const [diveCenterRef, setDiveCenterRef]= useState<Partial<ChoiceStateValue>>({
    id: divePlan.dive_center?.id,
    name: divePlan.dive_center?.name
  });

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalTypes | 0>(1);

  const [isInputError, setIsInputError] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<PlanErrMsg>({
    date: '',
    location: '',
    country_id: '',
    purpose_id: '',
    course: '',
    max_depth: '',
    start_time: '',
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
  });

  useEffect(() => {
    if (state.success) {
      router.push(`/plans/${state.divePlanId}`);
      toast.success('Successfully added new log');
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

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

    setIsScrollable(false);
    setModalType(modalType);
    setIsModalVisible(true);
  }

  const handleInputChange = (e:
    React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
    | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { id, value } = e.target;
    const newRecordVal: { [x:string]: string | number | Date } = {[id]: value};
    const newErrMsg = { [id]: '' };

    if (id === 'log_no') {
      newErrMsg.log_no = !value ? 'Please input log no'
        : Number(value) <= 0 ? 'Log no must be greater than 0'
        : !isNumber(Number(value)) ? 'Please input number'
        : '';
    } else if (id === 'date') {
      newErrMsg.date = !value ? 'Please input date' : '';
      if (!!value) {
        if (divePlan.start_time) {
          newRecordVal['start_time'] = combineDateTime(new Date(value), formatTime(divePlan.start_time));
        }
      }
    } else if (id === 'start_time') {
      const newStartTime = combineDateTime(divePlan.date || new Date(), value);
      newRecordVal.start_time = newStartTime;
      newErrMsg.start_time = '';
    } else if (id === 'buddy_ref') {
      newRecordVal.buddy_str = '';
    } else if (id === 'buddy_str') {
      newRecordVal.buddy_ref = '';
    } else if (id === 'supervisor_ref') {
      newRecordVal.supervisor_str = '';
    } else if (id === 'supervisor_str') {
      newRecordVal.supervisor_ref = '';
    } else if (id === 'dive_center_id') {
      newRecordVal.dive_center_str = '';
    } else if (id === 'dive_center_str') {
      newRecordVal.dive_center_id = '';
    } else if (isKeyWithNumVal(id)) {
      newErrMsg[id] = !value ? ''
        : !isNumber(Number(value)) ? 'Please input number'
        : Number(value) < 0 ? 'The value should not be below zero'
        : ''
    }

    setErrorMsg({...errorMsg, ...newErrMsg});
    setIsInputError(!isObjectValEmpty({...errorMsg, ...newErrMsg}));
    setDivePlan({ ...divePlan, ...newRecordVal });
  }

  const clearSelect = (e:MouseEvent<HTMLButtonElement>, modalType:ModalTypes):void  => {
    e.preventDefault();

    switch(modalType) {
      case diveRecordModalTypes.buddy:
        setBuddyRef({id: '', name: ''});
        setDivePlan({ ...divePlan, ...{ buddy_ref: '' } });
        setErrorMsg({...errorMsg,  ...{ buddy_ref: '' }});
        break;
      case diveRecordModalTypes.supervisor:
        setSupervisorRef({id: '', name: ''});
        setDivePlan({ ...divePlan, ...{ supervisor_ref: '' } });
        setErrorMsg({...errorMsg,  ...{ supervisor_ref: '' }});
        break;
      case diveRecordModalTypes.diveCenter:
        setDiveCenterRef({id: '', name: ''});
        setDivePlan({ ...divePlan, ...{ dive_center_id: '' } });
        setErrorMsg({...errorMsg,  ...{ dive_center_id: '' }});
        break;
    }
  }

  return (
    <div className={isScrollable ? '' : 'h-screenWOHeader overflow-y-hidden'}>
      <Heading pageTitle={"Add New Dive Plan"} />

      { isPending ? <>Loading...</> :
        <>
          <form action={formAction} className="w-11/12 max-w-xl h-fit mx-auto my-12">
            <p className="w-10/12 md:w-full text-center md:text-left mb-8 text-eyeCatchDark">* mandatory</p>

            {/* Date */}
            <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <label htmlFor="date" className="md:w-24 text-wra,p">
                Date<span className="text-eyeCatchDark">*</span>
              </label>
              <div className="w-full md:w-8/12">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={ divePlan.date ? getNumDate(divePlan.date) : ''}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.date || state.error?.date }</p>
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
                  value={ divePlan.location || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.location || state.error?.location }</p>
              </div>
            </div>

            <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <label htmlFor="country_id" className="md:w-24 text-wrap">Country/ Region</label>
              <div className="w-full md:w-8/12">
                {countryList && (
                  <select
                    name="country_id"
                    id="country_id"
                    value={ divePlan.country_id  || '' }
                    onChange={(e) => handleInputChange(e)}
                    className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
                  >
                    <option value="" > --- Please select --- </option>
                    <CountryOptions setCountryList={ setCountryList} />
                  </select>
                )}
                <p className="text-eyeCatchDark text-end">{ errorMsg.country_id || state.error?.country_id }</p>
              </div>
            </div>

            <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <label htmlFor="purpose_id" className="md:w-24 text-wrap">Purpose</label>
              <div className="w-full md:w-8/12">
                { purposeList && (
                  <select
                    name="purpose_id"
                    id="purpose_id"
                    value={ divePlan.purpose_id || '' }
                    onChange={(e) => handleInputChange(e)}
                    className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
                  >
                    <option value="" > --- Please select --- </option>
                    <DivePurposeOptions setPurposeList={ setPurposeList } />
                  </select>
                )}
                <p className="text-eyeCatchDark text-end">{ errorMsg.purpose_id || state.error?.purpose_id }</p>
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
                  value={ divePlan.course || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.course || state.error?.course }</p>
              </div>
            </div>

            {/* Start time */}
            <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <label htmlFor="start_time" className="md:w-24 text-wrap">Start time<span className="text-eyeCatchDark">*</span></label>
              <div className="w-full md:w-8/12">
                <input
                  type="time"
                  name="start_time"
                  id="start_time"
                  value={ divePlan.start_time ? formatTime(divePlan.start_time) : '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.start_time || state.error?.start_time }</p>
              </div>
            </div>

            {/* Weight */}
            <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <label htmlFor="added_weight" className="md:w-24 text-wrap">Weight added</label>
              <div className="w-full md:w-8/12">
                <input
                  type="number"
                  name="added_weight"
                  id="added_weight"
                  placeholder="Weight added"
                  value={ divePlan.added_weight || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.added_weight || state.error?.added_weight }</p>
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
                  value={ divePlan.suit || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.suit || state.error?.suit }</p>
              </div>
            </div>

            {/* Gears */}
            <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <label htmlFor="gears" className="md:w-24 text-wrap">Gears</label>
              <div className="w-full md:w-8/12">
                <input
                  type="text"
                  name="gears"
                  id="gears"
                  placeholder="Gears"
                  value={ divePlan.gears || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.gears || state.error?.gears }</p>
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
                  value={ divePlan.max_depth || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.max_depth || state.error?.max_depth }</p>
              </div>
            </div>

            {/* Buddy */}
            <div className="w-10/12 md:w-full h-28 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <div className='w-full md:w-4/12 md:h-2/3 flex justify-between md:flex-col md:justify-start mb-2'>
                <label
                  htmlFor={`${isBuddyById ? 'buddy_ref' : 'buddy_str'}`}
                  className="md:w-24 text-wrap mb-1 mr-3">
                  Buddy
                </label>
                <button
                  onClick={(e) => switchBuddyInput(e)}
                  className={`bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2`}
                >
                  {isBuddyById ? 'Manual Input' : 'Choose on DivLog'}
                </button>
              </div>

              <div className="w-full md:w-8/12 md:flex md:flex-col md:justify-between">
                { isBuddyById ? (
                  <div className='flex flex-col items-start justify-between'>
                    <p className='h-8 w-full bg-lightBlue opacity-80 text-black px-2 py-1 rounded-md'>
                      { buddyRef.name }
                    </p>
                    <div className='w-full flex justify-between'>
                      <div className='flex flex-row justify-start h-6 mt-2'>
                        <button
                          onClick={(e) => openSearchModal(e, diveRecordModalTypes.buddy)}
                          disabled={!isBuddyById}
                          className='rounded-md md:w-fit px-2 mr-2 bg-red-400 text-baseWhite'
                        >
                          Search
                        </button>
                        <button
                          onClick={(e) => clearSelect(e, diveRecordModalTypes.buddy)}
                          disabled={!isBuddyById}
                          className='rounded-md md:w-fit px-2 bg-gray-500 text-baseWhite'
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-eyeCatchDark text-end">
                        { state.error?.buddy_ref || errorMsg.buddy_ref }
                      </p>
                    </div>
                    <input
                      type="hidden"
                      name="buddy_ref"
                      id="buddy_ref"
                      value={ buddyRef.id || '' }
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      name="buddy_str"
                      id="buddy_str"
                      placeholder="Buddy"
                      value={ divePlan.buddy_str || '' }
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                    />
                    <p className="text-eyeCatchDark text-end">
                      { state.error?.buddy_str || errorMsg.buddy_str }
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Supervisor */}
            <div className="w-10/12 md:w-full h-28 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <div className='w-full md:w-4/12 md:h-2/3 flex justify-between md:flex-col md:justify-start mb-2'>
                <label
                  htmlFor={`${isSupervisorById ? 'supervisor_ref' : 'supervisor_str'}`}
                  className="md:w-24 text-wrap mb-1 mr-3"
                >
                  Supervisor
                </label>
                <div className='flex md:flex-col'>
                  <button
                    onClick={(e) => switchSupervisorInput(e)}
                    className='bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2'
                  >{isSupervisorById ? 'Manual Input' : 'Choose on DivLog'}</button>
                </div>
              </div>

              <div className="w-full md:w-8/12 md:flex md:flex-col md:justify-between">
                { isSupervisorById ? (
                  <div className='flex flex-col items-start justify-between'>
                    <p className='h-8 w-full bg-lightBlue opacity-80 text-black px-2 py-1 rounded-md'>
                      { supervisorRef.name }
                    </p>
                    <div className='w-full flex justify-between'>
                      <div className='flex flex-row justify-start h-6 mt-2'>
                        <button
                          onClick={(e) => openSearchModal(e, diveRecordModalTypes.supervisor)}
                          disabled={!isSupervisorById}
                          className='rounded-md md:w-fit px-2 mr-2 bg-red-400 text-baseWhite'
                        >
                          Search
                        </button>
                        <button
                          onClick={(e) => clearSelect(e, diveRecordModalTypes.supervisor)}
                          disabled={!isSupervisorById}
                          className='rounded-md md:w-fit px-2 bg-gray-500 text-baseWhite'
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-eyeCatchDark text-end">
                        { state.error?.supervisor_ref || errorMsg.supervisor_ref }
                      </p>
                    </div>
                    <input
                      type="hidden"
                      name="supervisor_ref"
                      id="supervisor_ref"
                      value={ supervisorRef.id || '' }
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      name="supervisor_str"
                      id="supervisor_str"
                      placeholder="Supervisor"
                      value={ divePlan.supervisor_str || '' }
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                    />
                    <p className="text-eyeCatchDark text-end">
                      { state.error?.supervisor_str || errorMsg.supervisor_str }
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Dive Center */}
            <div className="w-10/12 md:w-full h-28 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
              <div className='w-full md:w-4/12 md:h-2/3 flex justify-between md:flex-col md:justify-start mb-2'>
                <label
                  htmlFor={`${ isDiveCenterById ? 'dive_center_id' : 'dive_center_str' }`}
                  className="md:w-24 text-wrap mb-1 mr-3"
                >
                  Dive Center
                </label>
                <button
                  onClick={(e) => switchDiveCenterInput(e)}
                  className='bg-darkBlue dark:bg-lightBlue text-baseWhite dark:text-darkBlue rounded-md md:w-fit px-2 md:mb-2'
                >
                  {isDiveCenterById ? 'Manual Input' : 'Choose on DivLog'}
                </button>
              </div>

              <div className="w-full md:w-8/12 md:flex md:flex-col md:justify-between">
                { isDiveCenterById ? (
                  <div className='flex flex-col items-start justify-between'>
                    <p className='h-8 w-full bg-lightBlue opacity-80 text-black px-2 py-1 rounded-md'>
                      { diveCenterRef.name }
                    </p>
                    <div className='w-full flex justify-between'>
                      <div className='flex flex-row justify-start h-6 mt-2'>
                        <button
                          onClick={(e) => openSearchModal(e, diveRecordModalTypes.diveCenter)}
                          disabled={!isDiveCenterById}
                          className='rounded-md md:w-fit px-2 mr-2 bg-red-400 text-baseWhite'
                        >
                          Search
                        </button>
                        <button
                          onClick={(e) => clearSelect(e, diveRecordModalTypes.diveCenter)}
                          disabled={!isDiveCenterById}
                          className='rounded-md md:w-fit px-2 bg-gray-500 text-baseWhite'
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-eyeCatchDark text-end">
                        { state.error?.dive_center_id || errorMsg.dive_center_id }
                      </p>
                    </div>
                    <input
                      type="hidden"
                      name="dive_center_id"
                      id="dive_center_id"
                      value={ diveCenterRef.id || '' }
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      name="dive_center_str"
                      id="dive_center_str"
                      placeholder="DiveCenter"
                      value={ divePlan.dive_center_str || '' }
                      onChange={(e) => handleInputChange(e)}
                      className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
                    />
                    <p className="text-eyeCatchDark text-end">
                      { state.error?.dive_center_str || errorMsg.dive_center_str }
                    </p>
                  </>
                )}
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
                  value={ divePlan.notes || '' }
                  onChange={(e) => handleInputChange(e)}
                  className="w-full h-60 bg-lightBlue dark:bg-baseWhite px-2 mt-2 rounded text-black focus:outline-none"
                />
                <p className="text-eyeCatchDark text-end">{ errorMsg.notes || state.error?.notes }</p>
              </div>
            </div>

            <div className='w-full text-center mb-28'>
              <SaveNewLogBtn isDisabled={isInputError || isPending} />
            </div>
          </form>

          { isModalVisible && (
            <div className='w-screen h-screen fixed z-20 top-0 left-0 bg-baseWhite70'>
              <SearchModal
                type={ modalType }
                setData={
                  modalType === diveRecordModalTypes.buddy ? setBuddyRef
                  : modalType === diveRecordModalTypes.supervisor ? setSupervisorRef
                  : modalType === diveRecordModalTypes.diveCenter && setDiveCenterRef
                }
                setIsModalVisible={() => setIsModalVisible(false)}
              />
            </div>
          )}
        </>
      }
    </div>
  )
}

export default AddDivePlanPage;