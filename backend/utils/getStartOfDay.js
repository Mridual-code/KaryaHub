const getStartOfDay = (value = new Date()) => {
  const date = new Date(value);

  date.setHours(0, 0, 0, 0);

  return date;
};

module.exports = getStartOfDay;