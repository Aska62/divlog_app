const combineDateTime = (d, t) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yearMonthDate = `${String(year)}-${String(month)}-${String(day)}`;


  const hour = String(date.getHours());
  const minute = String(date.getMinutes());
  const formatHour = hour.length === 2 ? hour : `0${hour}`;
  const formatMinute = minute.length === 2 ? minute : `0${minute}`;


  return new Date(`${yearMonthDate} ${formatHour}:${formatMinute}`);
}

export default combineDateTime;