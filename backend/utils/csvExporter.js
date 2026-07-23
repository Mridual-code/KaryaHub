const escapeCsvValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const stringValue = String(value);

  const escapedValue =
    stringValue.replace(/"/g, '""');

  if (
    escapedValue.includes(",") ||
    escapedValue.includes('"') ||
    escapedValue.includes("\n")
  ) {
    return `"${escapedValue}"`;
  }

  return escapedValue;
};

const generateCsv = ({
  headers,
  rows
}) => {
  const headerLine = headers
    .map((header) =>
      escapeCsvValue(header.label)
    )
    .join(",");

  const dataLines = rows.map((row) =>
    headers
      .map((header) =>
        escapeCsvValue(
          row[header.key]
        )
      )
      .join(",")
  );

  return [
    headerLine,
    ...dataLines
  ].join("\n");
};

module.exports = {
  generateCsv
};
