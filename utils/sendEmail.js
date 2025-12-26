import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: { email: process.env.MAIL_FROM, name: "BiggEyes" },
      subject,
      html
    });
    console.log("✅ Email sent:", to);
  } catch (err) {
    console.error("❌ SendGrid Error:", err?.response?.body || err.message);
  }
};
