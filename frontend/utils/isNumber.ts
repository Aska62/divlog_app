const isNumber = (val:unknown): val is number => {
  if (!val || typeof val !== 'number') {
    return false;
  }

  return true;
}

export default isNumber;