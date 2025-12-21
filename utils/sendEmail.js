import sgMail from "@sendgrid/mail";

// SendGrid API key environment se load
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to, // recipient email
      from: process.env.MAIL_FROM, // verified sender email in SendGrid
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log("EMAIL SENT SUCCESSFULLY TO:", to);
  } catch (error) {
    console.error("EMAIL FAILED:", error.response ? error.response.body : error);
    throw new Error("Email sending failed");
  }
};
