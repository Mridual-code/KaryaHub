const calculateLeaveDays = (
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return 0;
  }

  if (end < start) {
    return 0;
  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    end.setHours(0, 0, 0, 0) -
    start.setHours(0, 0, 0, 0);

  return (
    Math.floor(
      difference / millisecondsPerDay
    ) + 1
  );
};

module.exports = calculateLeaveDays;