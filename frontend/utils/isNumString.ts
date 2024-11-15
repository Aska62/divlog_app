import isNumber from "./isNumber";

const isNumString = (val:unknown): val is number => {
  if (!val || typeof val !== 'string') {
    return false;
  }

  return isNumber(Number(val));
}

export default isNumString;