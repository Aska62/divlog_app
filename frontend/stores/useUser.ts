import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import isObjectEmpty from '@/utils/isObjectEmpty';

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
  userInfo?: UserInfo
  isAuth: boolean
};

type Action = {
  setUser: (userInfo: UserInfo) => void,
  removeUser: () => void,
  setIsAuth: (userInfo: UserInfo) => void,
};

const useUser = create(
  (persist<State & Action>(
    (set) => ({
      userInfo: {},
      isAuth: false,
      setUser: (userInfo) => set({ userInfo: userInfo }),
      removeUser: () => set({}),
      setIsAuth: (userInfo) => set({isAuth: !isObjectEmpty(userInfo)})
    }),
    { name: 'auth' }
  ))
);

export default useUser;