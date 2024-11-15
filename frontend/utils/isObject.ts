const isObject = (value:unknown) => {
  if(!value || typeof value !== 'object') {
    return false;
  }

  return true;
}

export default isObject;