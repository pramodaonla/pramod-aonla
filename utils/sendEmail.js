import sgMail from "@sendgrid/mail";

/* ================= SENDGRID CONFIG ================= */
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY missing in .env");
}

if (!process.env.MAIL_FROM) {
  console.error("❌ MAIL_FROM missing in .env");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* ================= SEND EMAIL ================= */
export const sendEmail = async (to, subject, html) => {
  try {
    if (!to || !subject || !html) {
      console.error("❌ sendEmail missing params", { to, subject });
      return;
    }

    const msg = {
      to,
      from: {
        email: process.env.MAIL_FROM,   // ✅ verified sender
        name: "BiggEyes"                // ✅ brand name
      },
      subject,
      html,

      // optional but professional
      replyTo: process.env.MAIL_FROM,

      // helps SendGrid analytics (safe)
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: true }
      }
    };

    await sgMail.send(msg);
    console.log("✅ EMAIL SENT TO:", to);

  } catch (error) {
    console.error(
      "❌ SENDGRID ERROR:",
      error?.response?.body || error.message
    );
    // ❗ intentionally NOT throwing
    // taaki API kabhi crash na ho
  }
};
