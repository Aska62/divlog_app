import isString from "../isString";

const calculateTimeGap = (start:Date, end:Date): number | false => {
  if (!start || !end || !isString(start) || !isString(end)) {
    return false;
  }

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  const millisecDiff = endTime - startTime;

  return millisecDiff > 0 ? Math.round(millisecDiff / (1000 * 60)) : false;
}

export default calculateTimeGap;