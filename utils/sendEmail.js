import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  await sgMail.send({
    to,
    from: { email: process.env.MAIL_FROM, name: "BiggEyes" },
    subject,
    html
  });
};
