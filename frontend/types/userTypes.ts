import isObject from "@/utils/isObject";
import isObjectEmpty from "@/utils/isObjectEmpty";
import isNumber from "@/utils/isNumber";
import { emailRegex } from "@/actions/registerUser";

export type UserType = {
  id            : string,
  divlog_name   : string,
  license_name? : string,
  email         : string,
  certification?: string,
  cert_org_id?  : number,
}

export const isUserType = (val:unknown): val is UserType => {
  if (!val || !isObject(val) || isObjectEmpty(val)) {
    return false;
  }

  const keys = ['id', 'divlog_name', 'license_name', 'email', 'certification', 'cert_org_id'];

  const wrongEntries = Object.entries(val).filter(([k, v]) =>
    !keys.includes(k) || (k === 'cert_org_id' && !isNumber(v)) || (k === 'email' && !v.match(emailRegex))
  );

  if (wrongEntries.length > 0) {
    return false;
  }

  return true;
}
