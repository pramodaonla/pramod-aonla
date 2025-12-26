import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY || !process.env.MAIL_FROM) {
  console.error("❌ SENDGRID_API_KEY or MAIL_FROM missing in .env");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: { email: process.env.MAIL_FROM, name: "BiggEyes" },
      subject,
      html,
      replyTo: process.env.MAIL_FROM,
      trackingSettings: { clickTracking: { enable: false }, openTracking: { enable: true } }
    });
    console.log("✅ EMAIL SENT TO:", to);
  } catch (error) {
    console.error("❌ SENDGRID ERROR:", error?.response?.body || error.message);
  }
};
