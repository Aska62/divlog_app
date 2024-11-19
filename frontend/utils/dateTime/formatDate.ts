import isNumber from "../isNumber";
import isString from "../isString";

const formatDate = (d:Date):string => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = getMonthStr(date.getMonth());
  const day = date.getDay();

  return `${month} ${day} ${year}`;
}

type MonthStr =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

type MonthStrings = Record<number, MonthStr>;

const monthStrings:MonthStrings = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

const isMonthStr = (val:unknown): val is MonthStr => {
  if (!val || !isString(val)) {
    return false;
  }

  const found = Object.entries(monthStrings).find(([, v]) => v === String(val));

  return found ? true : false;
}

const getMonthStr = (monthNum:number): MonthStr | false => {
  if (!isNumber(monthNum) || monthNum < 0 || monthNum > 11) {
    return false;
  }

  const monthStr = monthStrings[monthNum];

  return isMonthStr(monthStr) ? monthStr : false;
}

export default formatDate;