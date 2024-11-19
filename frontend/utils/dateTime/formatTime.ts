const formatTime = (d:Date):string => {
  const date = new Date(d);
  const hour = String(date.getHours());
  const minute = String(date.getMinutes());

  const formatHour = hour.length === 2 ? hour : `0${hour}`;
  const formatMinute = minute.length === 2 ? minute : `0${minute}`;

  return `${formatHour}:${formatMinute}`;
}

export default formatTime;