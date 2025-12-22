import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: process.env.MAIL_FROM, // verified sender
    subject,
    html
  };

  try {
    await sgMail.send(msg);
    console.log("EMAIL SENT:", to);
  } catch (error) {
    console.error(
      "SENDGRID ERROR:",
      error.response ? error.response.body : error.message
    );
    // ❗ intentionally not throwing (API must not fail)
  }
};
