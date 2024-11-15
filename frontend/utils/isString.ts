const isString = (val:unknown): val is string => {
  if (!val || typeof val !== 'string') {
    return false;
  }

  return true;
}

export default isString;