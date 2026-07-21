const calculateWorkingHours = (
  checkIn,
  checkOut
) => {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return 0;
  }

  const differenceInMilliseconds =
    end.getTime() - start.getTime();

  const differenceInHours =
    differenceInMilliseconds /
    (1000 * 60 * 60);

  return Number(
    differenceInHours.toFixed(2)
  );
};

module.exports = calculateWorkingHours;