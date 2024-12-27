const isString = (val:unknown): val is string => {
  if (!val || typeof val !== 'string') {
    return false;
  }

  return true;
}

export const isStringOrEmptyString = (val:unknown): val is string => {
  return typeof val === 'string';
}

export default isString;