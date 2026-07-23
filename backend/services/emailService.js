const {
  createTransporter
} = require("../config/mailer");

const sendEmail = async ({
  to,
  subject,
  html,
  text = ""
}) => {
  try {
    if (!to) {
      console.warn(
        "Email skipped: recipient missing"
      );

      return null;
    }

    const transporter =
      createTransporter();

    if (!transporter) {
      console.warn(
        "Email skipped: mail settings are incomplete"
      );

      return null;
    }

    const info =
      await transporter.sendMail({
        from:
          process.env.EMAIL_FROM ||
          process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
      });

    return info;
  } catch (error) {
    console.error(
      "Send email error:",
      error.message
    );

    return null;
  }
};

const sendBulkEmail = async ({
  recipients,
  subject,
  html,
  text = ""
}) => {
  const uniqueRecipients = [
    ...new Set(
      recipients.filter(Boolean)
    )
  ];

  const results = [];

  for (
    const recipient of
    uniqueRecipients
  ) {
    const result =
      await sendEmail({
        to: recipient,
        subject,
        html,
        text
      });

    results.push(result);
  }

  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmail
};