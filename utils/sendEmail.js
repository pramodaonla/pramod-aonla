import sgMail from "@sendgrid/mail";

// SendGrid API key set
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to: to,
      from: process.env.MAIL_FROM, // must be verified in SendGrid
      subject: subject,
      html: html,
    });

    console.log("EMAIL SENT TO:", to);

  } catch (error) {
    console.error("SENDGRID ERROR:", error.response?.body || error.message);
    throw error;
  }
};
