const isObjectValEmpty = (value:unknown): value is { string: '' | null | never } => {
  if(!value || typeof value !== 'object') {
    return false;
  }

  if (Object.keys(value).length === 0) {
    return false;
  }

  const withVal = Object.entries(value).filter(([, v]) => !!v);
  return withVal.length === 0;
}

export default isObjectValEmpty;