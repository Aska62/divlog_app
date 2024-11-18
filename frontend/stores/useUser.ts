import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export type UserInfo = {
  id?: string,
  divlog_name?: string,
  license_name?: string,
  certificate?: string,
  cert_org_id?: number
};

const userInfoKeys = [
  'id',
  'divlog_name',
  'license_name',
  'certification',
  'cert_org_id'
];

export const isUserInfo = (value: unknown):value is UserInfo => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Object.entries(value).some(([key, val]) =>
    !userInfoKeys.includes(key)
    || (key === 'cert_org_id' && val && typeof val !== 'number')
    || (key !== 'cert_org_id' && val && typeof val !== 'string')
  )) {
    return false;
  }

  return true;
}

type State = {
  isAuth: boolean
};

type Action = {
  setIsAuth: () => void,
};

const useUser = create(
  (persist<State & Action>(
    (set) => ({
      isAuth: false,
      setIsAuth: () => {
        const userSession =  localStorage.getItem('userInfo') || null;
        set({ isAuth: !!userSession });
      }
    }),
    {
      name: 'userAuthStatus',
    }
  ))
);

export default useUser;