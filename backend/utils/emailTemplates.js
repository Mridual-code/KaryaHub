const createEmailLayout = ({
  heading,
  content
}) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
    ">
      <div style="
        background: #1d4ed8;
        color: white;
        padding: 20px;
      ">
        <h2 style="margin: 0;">
          KaryaHub
        </h2>
      </div>

      <div style="padding: 24px;">
        <h3>${heading}</h3>

        ${content}

        <p style="
          margin-top: 30px;
          color: #666666;
          font-size: 13px;
        ">
          This email was sent automatically
          by KaryaHub HRMS.
        </p>
      </div>
    </div>
  `;
};

const welcomeEmployeeTemplate = ({
  name,
  employeeId,
  email,
  temporaryPassword
}) => {
  return createEmailLayout({
    heading: "Welcome to KaryaHub",
    content: `
      <p>Hello ${name},</p>

      <p>
        Your employee account has been
        created successfully.
      </p>

      <p>
        <strong>Employee ID:</strong>
        ${employeeId}
      </p>

      <p>
        <strong>Email:</strong>
        ${email}
      </p>

      ${
        temporaryPassword
          ? `
            <p>
              <strong>Temporary Password:</strong>
              ${temporaryPassword}
            </p>
          `
          : ""
      }

      <p>
        Please sign in and update your
        password if required.
      </p>
    `
  });
};

const leaveSubmittedTemplate = ({
  employeeName,
  leaveType,
  startDate,
  endDate
}) => {
  return createEmailLayout({
    heading: "New Leave Request",
    content: `
      <p>
        ${employeeName} submitted a new
        leave request.
      </p>

      <p>
        <strong>Leave Type:</strong>
        ${leaveType}
      </p>

      <p>
        <strong>Start Date:</strong>
        ${startDate}
      </p>

      <p>
        <strong>End Date:</strong>
        ${endDate}
      </p>
    `
  });
};

const leaveStatusTemplate = ({
  employeeName,
  leaveType,
  status,
  reviewComment
}) => {
  return createEmailLayout({
    heading:
      `Leave Request ${status}`,
    content: `
      <p>Hello ${employeeName},</p>

      <p>
        Your ${leaveType} leave request
        has been
        <strong>${status}</strong>.
      </p>

      ${
        reviewComment
          ? `
            <p>
              <strong>Comment:</strong>
              ${reviewComment}
            </p>
          `
          : ""
      }
    `
  });
};

const accountStatusTemplate = ({
  employeeName,
  status,
  reason
}) => {
  return createEmailLayout({
    heading:
      `Employee Account ${status}`,
    content: `
      <p>Hello ${employeeName},</p>

      <p>
        Your KaryaHub employee account
        has been ${status.toLowerCase()}.
      </p>

      ${
        reason
          ? `
            <p>
              <strong>Reason:</strong>
              ${reason}
            </p>
          `
          : ""
      }
    `
  });
};

module.exports = {
  welcomeEmployeeTemplate,
  leaveSubmittedTemplate,
  leaveStatusTemplate,
  accountStatusTemplate
};