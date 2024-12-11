'use client';
import { useState, useEffect } from 'react';
import isNumString from '@/utils/isNumString';
import isObjectValEmpty from '@/utils/isObjectValEmpty';
import { getUserProfile, UserProfile } from '@/actions/user/getUserProfile';
import { emailRegex } from '@/actions/registerUser';
import Heading from "@/components/Heading";
import OrganizationOptions from '@/components/OrganizationOptions';

const EditProfilePage = () => {
  const [user, setUser] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const getUser = async() => {
      const user = await getUserProfile();
      if (user) {
        setUser(user);
      }
    }
    getUser();
  }, []);

  type ErrMsg = Record<
    'divlog_name' | 'license_name' | 'email' | 'certification' | 'cert_org_id', string
  >;

  const [isInputError, setIsInputError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<ErrMsg>({
    divlog_name: '',
    license_name: '',
    email: '',
    certification: '',
    cert_org_id: '',
  });

  const handleInputChange = (e:
    React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { id, value } = e.target;
    const newRecordVal: { [x:string]: string | number | Date } = {[id]: value};
    const newErrMsg = { [id]: '' };

    newRecordVal[id] = value;

    if (id === 'divlog_name') {
      newErrMsg.divlog_name = !value ? 'Please input user name'
        : '';
    } else if (id === 'email') {
      newErrMsg.email = !value ? 'Please input email'
      : !value.match(emailRegex) ? 'Not a valid email address'
      : '';
    } else if (id === 'cert_org_id') {
      newErrMsg.cert_org_id = !isNumString(value) && value.length > 0 ? 'Please choose from the list' : '';
    }

    setErrorMsg({...errorMsg, ...newErrMsg});
    setIsInputError(!isObjectValEmpty({...errorMsg, ...newErrMsg}));
    setUser({ ...user, ...{[id]: value} });
  }

  return (
    <>
      <Heading pageTitle="Edit Profile" />

      <form className="w-11/12 max-w-xl h-fit mx-auto my-12">
        <p className="w-10/12 md:w-full text-center md:text-left mb-8 text-eyeCatchDark">* mandatory</p>

        {/* User name */}
        <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
          <label htmlFor="divlog_name" className="md:w-24 text-wrap">
            User name<span className="text-eyeCatchDark">*</span>
          </label>
          <div className="w-full md:w-8/12">
            <input
              type="text"
              name="divlog_name"
              id="divlog_name"
              placeholder="User name"
              value={ user.divlog_name || '' }
              onChange={(e) => handleInputChange(e)}
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
            />
          <p className="text-eyeCatchDark text-end">{ errorMsg.divlog_name }</p>
          {/* || state.error?.divlog_name  */}
          </div>
        </div>

        {/* Name on license */}
        <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
          <label htmlFor="license_name" className="md:w-24 text-wrap">
            Name on license
          </label>
          <div className="w-full md:w-8/12">
            <input
              type="test"
              name="license_name"
              id="license_name"
              value={ user.license_name || ''}
              onChange={(e) => handleInputChange(e)}
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
            />
            <p className="text-eyeCatchDark text-end">{ errorMsg.license_name }</p>
            {/* || state.error?.license_name  */}
          </div>
        </div>

        {/* Email */}
        <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
          <label htmlFor="email" className="md:w-24 text-wrap">
            Email<span className="text-eyeCatchDark">*</span>
          </label>
          <div className="w-full md:w-8/12">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={ user.email || '' }
              onChange={(e) => handleInputChange(e)}
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
            />
            <p className="text-eyeCatchDark text-end">{ errorMsg.email }</p>
            {/* || state.error?.email */}
          </div>
        </div>

        {/* Certificate */}
        <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
          <label htmlFor="certification" className="md:w-24 text-wrap">Certificate</label>
          <div className="w-full md:w-8/12">
            <input
              type="text"
              name="certification"
              id="certification"
              placeholder="Certificate"
              value={ user.certification || '' }
              onChange={(e) => handleInputChange(e)}
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded text-black focus:outline-none"
            />
            <p className="text-eyeCatchDark text-end">{ errorMsg.certification }</p>
            {/* || state.error?.certification  */}
          </div>
        </div>

        <div className="w-10/12 md:w-full h-20 md:h-14 my-3 mx-auto flex flex-col md:flex-row justify-start md:justify-between md:items-start">
          <label htmlFor="cert_org_id" className="md:w-24 text-wrap">Certificate issuer</label>
          <div className="w-full md:w-8/12">
            {/* {countryList && ( */}
              <select
                name="cert_org_id"
                id="cert_org_id"
                value={ user.cert_org_id  || '' }
                onChange={(e) => handleInputChange(e)}
                className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black focus:outline-none"
              >
                <option value="" > --- Please select --- </option>
                <OrganizationOptions />
              </select>
            {/* )} */}
            <p className="text-eyeCatchDark text-end">{ errorMsg.cert_org_id }</p>
            {/* || state.error?.cert_org_id  */}
          </div>
        </div>

        <div className='w-full text-center mt-12'>
        <button
          disabled={isInputError}
          className={`px-4 py-1 rounded-md ${ isInputError ? 'bg-slate-300 dark:bg-slate-500 text-baseWhite' : 'bg-darkBlue dark:bg-iceBlue hover:bg-darkBlueLight dark:hover:bg-lightBlue text-baseWhite dark:text-baseBlack'}`}
        >Save</button>
        </div>

      </form>
    </>
  );
}

export default EditProfilePage;