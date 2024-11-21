const isObject = (value:unknown): value is object => {
  if(!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return true;
}

export default isObject;