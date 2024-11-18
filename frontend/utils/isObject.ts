const isObject = (value:unknown) => {
  if(!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return true;
}

export default isObject;