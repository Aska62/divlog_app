const isArray = (value:unknown): value is [] => {
  if(!value || typeof value !== 'object' || !Array.isArray(value)) {
    return false;
  }

  return true;
}

export default isArray;