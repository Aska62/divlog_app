const combineDateTime = (d:Date, t:string): Date => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yearMonthDate = `${String(year)}-${String(month)}-${String(day)}`;
  return new Date(`${yearMonthDate} ${t}`);
}

export default combineDateTime;