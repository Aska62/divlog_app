const isNumber = (val:unknown): val is number => {
  if (typeof val !== 'number') {
    return false;
  }

  return true;
}

export default isNumber;