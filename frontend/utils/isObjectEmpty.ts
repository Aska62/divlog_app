const isObjectEmpty = (value:unknown) => {
  if(!value || typeof value !== 'object') {
    return true;
  }

  return Object.keys(value).length === 0;
}

export default isObjectEmpty;